import React from 'react';
import {SafeAreaView} from 'react-native';
import CameraComponent from './src/components/Camera';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <CameraComponent />
    </SafeAreaView>
  );
}

export default App;
