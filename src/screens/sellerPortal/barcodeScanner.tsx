import React, { useState, useEffect } from 'react';
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
import { Camera } from 'react-native-camera-kit';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';

type BarcodeScannerProps = NativeStackScreenProps<RootStackParamList, SCREENS.BarcodeScanner>;

const { width, height } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.7;

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState(0);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
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
      setHasPermission(true);
      setIsScanning(true);
    }
  };

  const handleBarcodeScan = async (event: { nativeEvent: { codeStringValue: string } }) => {
    const code = event.nativeEvent.codeStringValue;
    
    if (!code || !isScanning) return;

    // Prevent duplicate scans within 2 seconds
    const now = Date.now();
    if (now - lastScanTime < 2000) {
      return;
    }
    setLastScanTime(now);
    setScannedCode(code);
    setIsScanning(false);

    // Show confirmation alert
    Alert.alert(
      'Barcode Scanned',
      `Code: ${code}`,
      [
        {
          text: 'Scan Again',
          style: 'cancel',
          onPress: () => {
            setScannedCode(null);
            setIsScanning(true);
          }
        },
        {
          text: 'Use This Code',
          onPress: () => {
            navigation.navigate(SCREENS.AddProductScreen, {
              scannedBarcode: code,
            });
          }
        }
      ]
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
    if (scannedCode) {
      setScannedCode(null);
    }
  };

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
              hideControls={true}
            />
            
            {/* Scanner Overlay */}
            <View style={styles.overlay}>
              <View style={styles.overlayTop}>
                <Text style={styles.instructionText}>
                  Position the barcode within the frame
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
                </View>
                <View style={styles.overlaySide} />
              </View>
              
              <View style={styles.overlayBottom}>
                <Text style={styles.hintText}>
                  Make sure the barcode is clearly visible and well-lit
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.pausedContainer}>
            <Text style={styles.pausedText}>
              {scannedCode ? `Scanned: ${scannedCode}` : 'Scanning paused'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={toggleScanning}>
              <Text style={styles.buttonText}>
                {scannedCode ? 'Scan Again' : 'Resume Scanning'}
              </Text>
            </TouchableOpacity>
            {scannedCode && (
              <TouchableOpacity 
                style={[styles.button, styles.useCodeButton]} 
                onPress={() => {
                  navigation.navigate(SCREENS.AddProductScreen, {
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
          style={[styles.controlButton, !isScanning && styles.controlButtonActive]} 
          onPress={toggleScanning}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scannerFrame: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
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
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
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
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 160,
    alignItems: 'center',
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
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});