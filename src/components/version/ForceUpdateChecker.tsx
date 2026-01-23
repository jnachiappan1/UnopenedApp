import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppState, AppStateStatus, Platform } from 'react-native';
import ForceUpdateModal from '../../screens/auth/forceUpdateModal';
import { apiVersion as getAppVersion } from '../../utils/apiAction';
import { IAppVersion, IResponse } from '../../utils/types';
import { isForceUpdateRequired } from '../../utils/versionCheck';

/**
 * Component that checks app version and shows force update modal if needed
 * Add this component to your App.tsx or main navigation component
 */
const ForceUpdateChecker: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  // Check app version on mount and when app comes to foreground
  const { data: versionData, refetch } = useQuery<IResponse>({
    queryKey: ['appVersion'],
    queryFn: getAppVersion,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // Check every 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Listen to app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground, check for updates
        refetch();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, refetch]);

  // Check if force update is required
  useEffect(() => {
    if (versionData?.data) {
      // API returns data.appVersions as an array
      const appVersions = (versionData.data as any)?.appVersions;

      if (Array.isArray(appVersions) && appVersions.length > 0) {
        // Find the version for current platform
        const currentPlatform = Platform.OS === 'ios' ? 'ios' : 'android';
        const appVersion = appVersions.find(
          (v: IAppVersion) => v.platform === currentPlatform,
        ) as IAppVersion | undefined;

        if (appVersion) {
          console.log('App Version Check:', {
            platform: currentPlatform,
            currentVersion: appVersion.current_version,
            minimumVersion: appVersion.minimum_version,
          });

          const requiresUpdate = isForceUpdateRequired(appVersion);

          console.log('Force Update Required:', requiresUpdate);

          if (requiresUpdate) {
            setShowModal(true);
          } else {
            setShowModal(false);
          }
        } else {
          console.warn(
            `No version found for platform: ${currentPlatform}`,
            appVersions,
          );
        }
      } else {
        console.warn('Invalid appVersions data structure:', versionData.data);
      }
    }
  }, [versionData]);

  return <ForceUpdateModal visible={showModal} />;
};

export default ForceUpdateChecker;
