import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

export default function Cam({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const ref = useRef(null);
  const [cap, setCap] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  const takePhoto = async () => {
    const photo = await ref.current.takePictureAsync();
    navigation.navigate('cameraview', { image: photo.uri });
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [5, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      navigation.navigate('cameraview', { image: result.uri });
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}>
          <TouchableOpacity
            style={{ position: 'relative', top: 30, left: 310 }}>
            <MaterialCommunityIcons
              onPress={() => navigation.goBack()}
              name="close"
              size={36}
              color="white"
              style={{ marginLeft: '3%' }}
            />
          </TouchableOpacity>
          <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View style={{ flex: 0.8, flexDirection: 'row' }}>
                <TouchableOpacity onPress={pickImage} style={{}}>
                  <View style={{ height: 70, width: 70, borderRadius: 8 }}>
                    <Image
                      source={{
                        uri:
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2riEVmS1ERzJEbFi1kjLEtMi-smszA5Bzpw&usqp=CAU',
                      }}
                      style={{ resizeMode: 'contain', width: 50, height: 50,marginTop:20 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, position: 'relative', bottom: '9%' }}>
                <TouchableOpacity onPress={takePhoto} style={{}}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: 'white',
                      borderRadius: 100,
                    }}></View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ marginTop: '10%' }}>
                <MaterialCommunityIcons
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                  name="camera-party-mode"
                  size={36}
                  color="white"
                  style={{}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Camera>
    </View>
  );
}
