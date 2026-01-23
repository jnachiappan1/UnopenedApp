import { Platform } from 'react-native';
import { iOSCurrentVersion, AndroidCurrentVersion } from './api';
import { IAppVersion } from './types';

/**
 * Compare two version strings
 * @param version1 - First version (e.g., "1.2.3")
 * @param version2 - Second version (e.g., "1.2.4")
 * @returns 1 if version1 > version2, -1 if version1 < version2, 0 if equal
 */
export const compareVersions = (version1: string, version2: string): number => {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  console.log(v1parts, v2parts, "[][][][][[][");

  // Pad arrays to same length
  const maxLength = Math.max(v1parts.length, v2parts.length);
  while (v1parts.length < maxLength) v1parts.push(0);
  while (v2parts.length < maxLength) v2parts.push(0);

  for (let i = 0; i < maxLength; i++) {
    if (v1parts[i] > v2parts[i]) return 1;
    if (v1parts[i] < v2parts[i]) return -1;
  }
  return 0;
};

/**
 * Get current app version based on platform
 */
export const getCurrentAppVersion = (): string => {
  return Platform.OS === 'ios' ? iOSCurrentVersion : AndroidCurrentVersion;
};

/**
 * Check if force update is required
 * @param appVersion - Version data from API
 * @returns true if current version is less than minimum required version
 */
export const isForceUpdateRequired = (
  appVersion: IAppVersion | null | undefined,
): boolean => {
  if (!appVersion || !appVersion.minimum_version) {
    return false;
  }

  const currentVersion = getCurrentAppVersion();
  const minimumVersion = appVersion.minimum_version;

  // If current version is less than minimum version, force update is required
  return compareVersions(currentVersion, minimumVersion) < 0;
};
