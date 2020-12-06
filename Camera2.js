import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity ,Image} from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from 'react-native-elements';

export default function Cam2({ navigation, route }) {
  const { username, id, propic } = route.params;
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
    let photo = await ref.current.takePictureAsync();

    navigation.navigate('chatcamera', {
      image: photo.uri,
      userpropic: propic,
      id: id,
      username: username,
    });

    photo = null;
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
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
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              top: 600,
            }}>
            <TouchableOpacity
              style={{ position: 'relative', right: 30, top: 30 }}>
            
                 <Image
                      source={{
                        uri:
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2riEVmS1ERzJEbFi1kjLEtMi-smszA5Bzpw&usqp=CAU',
                      }}
                      style={{ resizeMode: 'contain', width: 70, height: 70,marginTop:20 }}
                    />
               
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePhoto}
              style={{ position: 'relative', left: 34 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'white',
                  borderRadius: 100,
                }}></View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ position: 'relative', left: '15%', top: 49 }}>
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
                style={{ marginLeft: '3%' }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}
