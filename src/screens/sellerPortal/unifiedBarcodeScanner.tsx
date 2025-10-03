import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  PermissionsAndroid,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
  AppState,
  BackHandler
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { showAlert } from '../../components/cAlert/cAlert';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';

type UnifiedBarcodeScannerProps = NativeStackScreenProps<RootStackParamList, SCREENS.BarcodeScanner>;

const { width, height } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.7;

const UnifiedBarcodeScanner: React.FC<UnifiedBarcodeScannerProps> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scannedFormat, setScannedFormat] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  // Request camera permissions
  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
        const hasPermission = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;
        setHasPermission(hasPermission);
        if (hasPermission) {
          setIsScanning(true);
        }
      } catch (error) {
        console.error('Permission request error:', error);
        setHasPermission(false);
      }
    } else {
      // iOS permissions are handled automatically by react-native-camera-kit
      setHasPermission(true);
      setIsScanning(true);
    }
  }, []);

  // Initialize permissions
  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  // Handle app state changes and screen focus
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        setIsFocused(true);
        if (hasPermission && !isCleaningUp) {
          setIsScanning(true);
        }
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        setIsFocused(false);
        setIsScanning(false);
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [appState, hasPermission, isCleaningUp]);

  // Handle screen focus/blur
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsFocused(true);
      if (hasPermission && !isCleaningUp) {
        setIsScanning(true);
      }
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setIsFocused(false);
      setIsScanning(false);
    });

    return () => {
      unsubscribe();
      unsubscribeBlur();
    };
  }, [navigation, hasPermission, isCleaningUp]);

  // Update scanning state based on permissions and focus
  useEffect(() => {
    if (hasPermission && isFocused && !isCleaningUp) {
      setIsScanning(true);
    } else {
      setIsScanning(false);
    }
  }, [hasPermission, isFocused, isCleaningUp]);

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && isProcessing) {
      setIsProcessing(false);
      if (isFocused && !isCleaningUp) {
        setIsScanning(true);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isProcessing, isFocused, isCleaningUp]);

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isCleaningUp) {
        return true; // Prevent back press during cleanup
      }
      goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [isCleaningUp]);

  // Handle barcode scan
  const handleBarcodeScan = useCallback(async (event: { nativeEvent: { codeStringValue: string; codeFormat?: string } }) => {
    const { codeStringValue: code, codeFormat } = event.nativeEvent;
    
    if (!code || !isScanning || isProcessing || isCleaningUp) return;
    
    // Prevent duplicate scans within 2 seconds
    const now = Date.now();
    if (now - lastScanTime < 2000) {
      return;
    }
    
    setLastScanTime(now);
    setScannedCode(code);
    setScannedFormat(codeFormat ?? 'unknown');
    setIsScanning(false);
    setIsProcessing(true);
    setCountdown(10); // Start 10 second countdown for camera adjustment
    
    // Show confirmation alert
    showAlert({
      isVisible: true,
      type: 'success',
      title: 'Barcode Scanned Successfully!',
      description: `Code: ${code}\nType: ${codeFormat ?? 'unknown'}\n\nTake your time to adjust the camera position for the next scan.`,
      deleteText: 'Scan Again',
      doneText: 'Use This Code',
      onDeletePress: () => {
        setScannedCode(null);
        setScannedFormat(null);
        setIsProcessing(true);
        setCountdown(10);
      },
      onDonePress: () => {
        setIsProcessing(false);
        setCountdown(0);
        // Clean up camera before navigation
        setIsScanning(false);
        setTimeout(() => {
          navigation.navigate(SCREENS.AddProductScreen, {
            scannedBarcode: code,
          });
        }, 100);
      },
    });
  }, [isScanning, isProcessing, isCleaningUp, lastScanTime, navigation]);

  // Clean up camera and navigate back
  const goBack = useCallback(() => {
    if (isCleaningUp) return;
    
    try {
      setIsCleaningUp(true);
      setIsScanning(false);
      
      // Add a small delay for cleanup
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } catch (error) {
      console.error('Error during goBack cleanup:', error);
      navigation.goBack();
    }
  }, [isCleaningUp, navigation]);

  // Toggle scanning state
  const toggleScanning = useCallback(() => {
    if (isProcessing || isCleaningUp) return;
    
    setIsScanning(!isScanning);
    if (scannedCode) {
      setScannedCode(null);
      setScannedFormat(null);
    }
  }, [isProcessing, isCleaningUp, isScanning, scannedCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsScanning(false);
    };
  }, []);

  // Loading state
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Barcode Scanner</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Requesting camera permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied state
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Barcode Scanner</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Camera permission is required to scan barcodes</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermissions}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Barcode</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {isScanning ? (
          <>
            <Camera
              style={styles.camera}
              scanBarcode={true}
              onReadCode={handleBarcodeScan}
              showFrame={false}
              scanThrottleDelay={1500}
              cameraType={CameraType.Back}
              // Additional props for better performance
              focusMode="on"
              zoomMode="off"
              torchMode="off"
              ratioOverlay="1:1"
              ratioOverlayColor="#00000077"
            />
            
            {/* Scanner Overlay */}
            <View style={styles.overlay}>
              <View style={styles.overlayTop}>
                <Text style={styles.instructionText}>
                  Position the barcode within the green frame
                </Text>
                <Text style={styles.instructionSubtext}>
                  Keep steady, ensure good lighting, and hold horizontally
                </Text>
              </View>
              
              <View style={styles.overlayMiddle}>
                <View style={styles.overlaySide} />
                <View style={styles.scannerFrame}>
                  {/* Scanner corners */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                  
                  {/* Scanning line animation */}
                  <View style={styles.scanLine} />
                  
                  {/* Active scanning indicator */}
                  <View style={styles.scanningIndicator}>
                    <Text style={styles.scanningText}>SCANNING...</Text>
                  </View>
                </View>
                <View style={styles.overlaySide} />
              </View>
              
              <View style={styles.overlayBottom}>
                <Text style={styles.hintText}>
                  Supports: UPC-A, UPC-E, EAN-13, EAN-8, Code-128, Code-39, Code-93, Codabar, QR Code, Data Matrix, PDF-417, Aztec
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.pausedContainer}>
            <Text style={styles.pausedText}>
              {scannedCode ? `Scanned: ${scannedCode}\nType: ${scannedFormat ?? 'unknown'}` : 'Scanning paused'}
            </Text>
            {isProcessing && (
              <Text style={styles.processingText}>
                {countdown > 0 
                  ? `Camera adjustment time: ${countdown}s\nPosition your next barcode in the frame`
                  : 'Camera ready! You can start scanning again'
                }
              </Text>
            )}
            <TouchableOpacity 
              style={[styles.button, isProcessing && styles.buttonDisabled]} 
              onPress={toggleScanning}
              disabled={isProcessing || isCleaningUp}
            >
              <Text style={styles.buttonText}>
                {isCleaningUp ? 'Cleaning up...' : scannedCode ? 'Scan Again' : 'Resume Scanning'}
              </Text>
            </TouchableOpacity>
            {scannedCode && !isProcessing && !isCleaningUp && (
              <TouchableOpacity 
                style={[styles.button, styles.useCodeButton]} 
                onPress={() => {
                  setIsScanning(false);
                  setTimeout(() => {
                    navigation.navigate(SCREENS.AddProductScreen, {
                      scannedBarcode: scannedCode,
                    });
                  }, 100);
                }}
              >
                <Text style={styles.buttonText}>Use This Code</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity 
          style={[styles.controlButton, !isScanning && styles.controlButtonActive, (isProcessing || isCleaningUp) && styles.controlButtonDisabled]} 
          onPress={toggleScanning}
          disabled={isProcessing || isCleaningUp}
        >
          <Text style={styles.controlButtonText}>
            {isCleaningUp ? 'Cleaning up...' : isScanning ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, isCleaningUp && styles.controlButtonDisabled]} 
          onPress={goBack}
          disabled={isCleaningUp}
        >
          <Text style={styles.controlButtonText}>
            {isCleaningUp ? 'Please wait...' : 'Cancel'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UnifiedBarcodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCANNER_SIZE,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  scannerFrame: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF00',
    borderWidth: 3,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#00FF00',
    opacity: 0.8,
  },
  scanningIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanningText: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  instructionSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  hintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 16,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  pausedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
  },
  pausedText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  processingText: {
    color: '#FFA500',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    opacity: 0.7,
  },
  useCodeButton: {
    backgroundColor: '#00C851',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 100,
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  controlButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    opacity: 0.7,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
