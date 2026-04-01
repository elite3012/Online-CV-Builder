package com.cvbuilder.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    @Value("${auth.login.maxAttempts:5}")
    private int maxAttempts;

    @Value("${auth.login.windowMs:60000}")
    private long windowMs;

    @Value("${auth.login.blockMs:120000}")
    private long blockMs;

    private final ConcurrentHashMap<String, AttemptState> attempts = new ConcurrentHashMap<>();

    private static class AttemptState {
        int count;
        long firstAttemptTime;
        long blockedUntil;

        AttemptState(long now) {
            this.count = 1;
            this.firstAttemptTime = now;
            this.blockedUntil = 0;
        }
    }

    public boolean isBlocked(String key) {
        if (key == null) return false;
        AttemptState state = attempts.get(key);
        if (state == null) return false;

        long now = System.currentTimeMillis();
        if (state.blockedUntil > now) {
            return true;
        } else if (state.blockedUntil > 0) {
            // Block expired, clear it out
            attempts.remove(key);
            return false;
        }
        return false;
    }

    public long retryAfterSeconds(String key) {
        AttemptState state = attempts.get(key);
        if (state == null || state.blockedUntil == 0) return 0;
        long waitTime = state.blockedUntil - System.currentTimeMillis();
        return waitTime > 0 ? waitTime / 1000 : 0;
    }

    public void recordFailure(String key) {
        if (key == null) return;
        long now = System.currentTimeMillis();

        attempts.compute(key, (k, state) -> {
            if (state == null) {
                return new AttemptState(now);
            }
            if (state.blockedUntil > now) {
                return state;
            }
            if (now - state.firstAttemptTime > windowMs) {
                // reset window
                state.count = 1;
                state.firstAttemptTime = now;
                return state;
            }

            state.count++;
            if (state.count >= maxAttempts) {
                state.blockedUntil = now + blockMs;
            }
            return state;
        });
    }

    public void recordSuccess(String key) {
        if (key != null) {
            attempts.remove(key);
        }
    }
}