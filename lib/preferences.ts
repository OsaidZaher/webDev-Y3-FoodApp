/**
 * User Preferences Utility
 * Manages user preferences stored in localStorage
 */

export interface UserPreferences {
  locationEnabled: boolean;
  historyEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  locationEnabled: true,
  historyEnabled: true,
};

/**
 * Get user-specific preferences storage key
 */
function getPreferencesKey(userId?: string): string {
  if (!userId) {
    return 'user_preferences_guest';
  }
  return `user_preferences_${userId}`;
}

/**
 * Get user preferences from localStorage
 */
export function getUserPreferences(userId?: string): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }
  
  try {
    const key = getPreferencesKey(userId);
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      // Merge with defaults to ensure all properties exist
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error reading preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save user preferences to localStorage
 */
export function saveUserPreferences(preferences: Partial<UserPreferences>, userId?: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const key = getPreferencesKey(userId);
    const current = getUserPreferences(userId);
    const updated = { ...current, ...preferences };
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

/**
 * Check if location services are enabled
 */
export function isLocationEnabled(userId?: string): boolean {
  return getUserPreferences(userId).locationEnabled;
}

/**
 * Check if history saving is enabled
 */
export function isHistoryEnabled(userId?: string): boolean {
  return getUserPreferences(userId).historyEnabled;
}

/**
 * Update location preference
 */
export function setLocationEnabled(enabled: boolean, userId?: string): void {
  saveUserPreferences({ locationEnabled: enabled }, userId);
}

/**
 * Update history preference
 */
export function setHistoryEnabled(enabled: boolean, userId?: string): void {
  saveUserPreferences({ historyEnabled: enabled }, userId);
}
