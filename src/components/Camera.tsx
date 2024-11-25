import React, {useCallback, useState} from 'react';
import {Text, StyleSheet, Alert, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

const CameraComponent = () => {
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [lastScanned, setLastScanned] = useState('');

  const codeScanner = useCodeScanner({
    // detects but unwant values: upc-e, ean-13
    // not detect codeTypes: ['codabar', 'itf', 'upc-a', 'ean-8'],
    codeTypes: ['code-128', 'qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0].value !== lastScanned) {
        setLastScanned(codes[0].value || '');
        Alert.alert(
          'Barcode Detected',
          `Value: ${codes[0].value}\nType: ${codes[0].type}`,
        );
        console.log('Scanned code:', {
          value: codes[0].value,
          type: codes[0].type,
        });
      }
    },
  });

  const requestCameraPermission = useCallback(async () => {
    const permission = await requestPermission();
    if (!permission) {
      Alert.alert(
        'Permission required',
        'Camera permission is required to scan barcodes',
        [{text: 'OK', onPress: requestCameraPermission}],
      );
    }
  }, [requestPermission]);

  if (!hasPermission) {
    requestCameraPermission();
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        // enableZoomGesture
        // photo={true}
        // video={false}
        // audio={false}
        // preset="high"
        // format={{
        //   photoCodec: 'jpeg',
        // }}
        // fps={30}
        // hdr={false}
        // lowLightBoost={true}
      />
      {lastScanned ? (
        <View style={styles.overlay}>
          <Text style={styles.text}>Last scanned: {lastScanned}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
});

export default CameraComponent;
