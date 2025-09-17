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
  Alert
} from 'react-native';
import { Camera, useCameraDevices, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { showAlert } from '../../components/cAlert/cAlert';

type BarcodeScannerProps = NativeStackScreenProps<RootStackParamList, SCREENS.BarcodeScanner>;

const { width, height } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.7;

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scannedFormat, setScannedFormat] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Vision Camera hooks
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  useEffect(() => {
    if (hasPermission) {
      setIsScanning(true);
    } else {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && isProcessing) {
      setIsProcessing(false);
      setIsScanning(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isProcessing]);

  // Code scanner configuration with all supported formats
  const codeScanner = useCodeScanner({
    codeTypes: [
      'upc-a', 'upc-e', 'ean-13', 'ean-8', 'code-128', 'code-39', 'code-93', 'codabar', 
      'qr', 'pdf-417', 'aztec', 'data-matrix', 'itf-14',
      'gs1-data-bar', 'gs1-data-bar-expanded', 'gs1-data-bar-limited'
    ],
    onCodeScanned: useCallback((codes) => {
      console.log('Barcode scan detected:', codes);
      
      if (codes.length > 0 && isScanning && !isProcessing) {
        const code = codes[0];
        const codeValue = code.value;
        const codeFormat = code.type || 'unknown';
        
        console.log('Detected barcode:', { value: codeValue, type: codeFormat });
        
        if (!codeValue) {
          console.log('No barcode value found');
          return;
        }

        const now = Date.now();
        if (now - lastScanTime < 1000) {
          console.log('Duplicate scan prevented');
          return;
        }
        
        setLastScanTime(now);
        setScannedCode(codeValue);
        setScannedFormat(codeFormat ?? 'unknown');
        setIsScanning(false);
        setIsProcessing(false);
        setCountdown(10);
        showAlert({
          isVisible: true,
          type: 'success',
          title: 'Barcode Scanned Successfully! ',
          description: `Code: ${codeValue}\nType: ${codeFormat}\n\nTake your time to adjust the camera position for the next scan.`,
          deleteText: 'Scan Again',
          doneText: 'Use This Code',
          onDeletePress: () => {
            setScannedCode(null);
            setScannedFormat(null);
            setIsProcessing(false);
            setCountdown(10);
            setIsScanning(true);
          },
          onDonePress: () => {
            setIsProcessing(false);
            setCountdown(0);
            navigation.replace(SCREENS.AddProductScreen, {
              scannedBarcode: codeValue,
            });
          },
        });
      }
    }, [isScanning, isProcessing, lastScanTime, navigation])
  });

  const goBack = () => {
    navigation.goBack();
  };

  const toggleScanning = () => {
    if (isProcessing) return; // Prevent toggling while processing
    
    setIsScanning(!isScanning);
    if (scannedCode) {
      setScannedCode(null);
      setScannedFormat(null);
    }
  };

  if (!hasPermission) {
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
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
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
          <Text style={styles.message}>No camera device found</Text>
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
              device={device}
              isActive={isScanning}
              codeScanner={codeScanner}
              focusable={true}
              enableZoomGesture={false}
            />
            
            {/* Scanner Overlay */}
            <View style={styles.overlay}>
              <View style={styles.overlayTop}>
                <Text style={styles.instructionText}>
                  Position the UPC-A barcode within the green frame
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
                  For UPC-A barcodes: Center the barcode in the frame\nKeep 6-12 inches away with good lighting
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
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>
                {scannedCode ? 'Scan Again' : 'Resume Scanning'}
              </Text>
            </TouchableOpacity>
            {scannedCode && !isProcessing && (
              <TouchableOpacity 
                style={[styles.button, styles.useCodeButton]} 
                onPress={() => {
                  navigation.replace(SCREENS.AddProductScreen, {
                    scannedBarcode: scannedCode,
                  });
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
          style={[styles.controlButton, !isScanning && styles.controlButtonActive, isProcessing && styles.controlButtonDisabled]} 
          onPress={toggleScanning}
          disabled={isProcessing}
        >
          <Text style={styles.controlButtonText}>
            {isScanning ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={goBack}>
          <Text style={styles.controlButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BarcodeScanner;

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
    // This makes the scanner frame transparent so camera shows through
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
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
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