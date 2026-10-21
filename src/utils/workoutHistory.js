const LEGACY_HISTORY_KEY = 'forge_workout_history';

export function getWorkoutHistoryKey(userId) {
  return userId ? `${LEGACY_HISTORY_KEY}_${userId}` : LEGACY_HISTORY_KEY;
}

export function readWorkoutHistory(userId) {
  try {
    const storageKey = getWorkoutHistoryKey(userId);
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored);

    // Move existing device history into the first authenticated profile that opens it.
    if (userId) {
      const legacy = localStorage.getItem(LEGACY_HISTORY_KEY);
      if (legacy) {
        localStorage.setItem(storageKey, legacy);
        localStorage.removeItem(LEGACY_HISTORY_KEY);
        return JSON.parse(legacy);
      }
    }
  } catch {
    return [];
  }
  return [];
}

export function writeWorkoutHistory(userId, history) {
  try {
    localStorage.setItem(getWorkoutHistoryKey(userId), JSON.stringify(history));
  } catch {
    // Ignore storage errors (for example, when browser storage is disabled).
  }
}
