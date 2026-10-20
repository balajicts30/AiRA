// ============================================================================
// CATEGORY-AWARE CACHING, RATE LIMITING, CIRCUIT BREAKERS & REQUEST COALESCING
// ============================================================================

import { DEFAULT_CATEGORY_FRESHNESS_POLICIES } from "./freshnessPolicy";
import { ContentCategory } from "./types";

interface CacheEntry<T> {
  value: T;
  category: ContentCategory;
  storedAtMs: number;
  expiresAtMs: number;
  staleUntilMs: number;
}

export class CategoryAwareCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  public get(
    key: string,
    nowMs = Date.now()
  ): {
    status: "miss" | "hit_fresh" | "stale_revalidated";
    value?: T;
  } {
    const entry = this.store.get(key);
    if (!entry) return { status: "miss" };

    // Strictly do NOT extend expiresAtMs on access
    if (nowMs <= entry.expiresAtMs) {
      return { status: "hit_fresh", value: entry.value };
    }

    const policy =
      DEFAULT_CATEGORY_FRESHNESS_POLICIES[entry.category] ||
      DEFAULT_CATEGORY_FRESHNESS_POLICIES.news;

    if (policy.allowStaleWhileRevalidate && nowMs <= entry.staleUntilMs) {
      return { status: "stale_revalidated", value: entry.value };
    }

    this.store.delete(key);
    return { status: "miss" };
  }

  public set(
    key: string,
    value: T,
    category: ContentCategory,
    customTtlMs?: number,
    nowMs = Date.now()
  ): void {
    const policy =
      DEFAULT_CATEGORY_FRESHNESS_POLICIES[category] ||
      DEFAULT_CATEGORY_FRESHNESS_POLICIES.news;
    const ttl = customTtlMs ?? policy.cacheTtlMs;
    const staleGrace = policy.allowStaleWhileRevalidate ? ttl * 2 : 0;

    this.store.set(key, {
      value,
      category,
      storedAtMs: nowMs,
      expiresAtMs: nowMs + ttl,
      staleUntilMs: nowMs + ttl + staleGrace
    });
  }

  public invalidate(keyPrefix?: string): void {
    if (!keyPrefix) {
      this.store.clear();
      return;
    }
    for (const k of Array.from(this.store.keys())) {
      if (k.startsWith(keyPrefix)) {
        this.store.delete(k);
      }
    }
  }
}

interface ProviderState {
  tokens: number;
  lastRefillMs: number;
  maxTokens: number;
  refillRatePerSec: number;
  consecutiveFailures: number;
  circuitOpenUntilMs: number;
}

export class ProviderResilienceManager {
  private states = new Map<string, ProviderState>();
  private inFlight = new Map<string, Promise<any>>();

  private getOrCreateState(providerId: string, maxRequestsPerMin = 30): ProviderState {
    let st = this.states.get(providerId);
    if (!st) {
      st = {
        tokens: maxRequestsPerMin,
        lastRefillMs: Date.now(),
        maxTokens: maxRequestsPerMin,
        refillRatePerSec: maxRequestsPerMin / 60,
        consecutiveFailures: 0,
        circuitOpenUntilMs: 0
      };
      this.states.set(providerId, st);
    }
    return st;
  }

  public checkAvailability(
    providerId: string,
    nowMs = Date.now()
  ): { allowed: boolean; reason?: "rate_limited" | "circuit_open" } {
    const st = this.getOrCreateState(providerId);

    if (nowMs < st.circuitOpenUntilMs) {
      return { allowed: false, reason: "circuit_open" };
    }

    const elapsedSec = Math.max(0, (nowMs - st.lastRefillMs) / 1000);
    st.tokens = Math.min(st.maxTokens, st.tokens + elapsedSec * st.refillRatePerSec);
    st.lastRefillMs = nowMs;

    if (st.tokens < 1) {
      return { allowed: false, reason: "rate_limited" };
    }

    st.tokens -= 1;
    return { allowed: true };
  }

  public recordSuccess(providerId: string): void {
    const st = this.getOrCreateState(providerId);
    st.consecutiveFailures = 0;
    st.circuitOpenUntilMs = 0;
  }

  public recordFailure(providerId: string, nowMs = Date.now()): void {
    const st = this.getOrCreateState(providerId);
    st.consecutiveFailures += 1;
    if (st.consecutiveFailures >= 3) {
      // Open circuit for 45 seconds after 3 consecutive failures
      st.circuitOpenUntilMs = nowMs + 45 * 1000;
    }
  }

  /**
   * Coalesces concurrent identical requests so duplicate requests share a single execution.
   */
  public async coalesce<R>(dedupeKey: string, fn: () => Promise<R>): Promise<R> {
    const existing = this.inFlight.get(dedupeKey);
    if (existing) {
      return existing as Promise<R>;
    }

    const promise = fn().finally(() => {
      this.inFlight.delete(dedupeKey);
    });
    this.inFlight.set(dedupeKey, promise);
    return promise;
  }
}

export async function executeWithBackoff<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number; timeoutMs?: number } = {}
): Promise<T> {
  const { maxRetries = 2, baseDelayMs = 350, timeoutMs = 6500 } = options;
  let lastErr: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await Promise.race<T>([
        fn(),
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);
      return result;
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries) {
        const jitter = Math.floor(Math.random() * 120);
        const delay = baseDelayMs * Math.pow(2, attempt) + jitter;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastErr;
}

export const globalResilienceManager = new ProviderResilienceManager();
