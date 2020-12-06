import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity,ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';
import { auth, db, storage } from './firebase.js';
import firebase from '@firebase/app';

function Cameraview({ navigation, route }) {
  const { image } = route.params;
  const [propic, setPropic] = useState(null);
  const [act,setAct]=useState(false);

  const user = auth.currentUser;
  useEffect(() => {
    try {
      if (user?.uid) {
        db.collection('users')
          .doc(user?.uid)
          .onSnapshot((doc) => {
            setPropic(doc.data().propic);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  const uploadImage = async () => {
    setAct(true)
    const response = await fetch(image);
    const blob = await response.blob(image);

    const uploadTask = storage.ref('images').child('imagesname').put(blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 0.1
        );
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },

      () => {
        storage
          .ref('images')
          .child('imagesname')
          .getDownloadURL()
          .then((url) => {
            db.collection('stories').doc(user.uid).set({
              storyurl: url,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              propic: propic,
              userid: user.uid,
            });
            db.collection('users').doc(user.uid).update({
              storyurl: url,
            });
          })
          .then(() => {
            setAct(false)
            navigation.navigate('Home');
          });
      }
    );
  };
  return (
    <View style={{ backgroundColor: 'black', height: "100%" }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
          borderBottomColor:'none'
        }}
        placement="left"
        leftComponent={
          <Icons
            onPress={() => navigation.navigate('Home')}
            name={'close'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
      />
      {!act?(
        <View style={{position:'absolute',bottom:0}}>
<Image
        source={{ uri: image }}
        style={{ width: 360, height: 700, resizeMode: 'contain' }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'absolute',
          bottom: 30,
        }}>
        <TouchableOpacity
          onPress={uploadImage}
          style={{ alignItems: 'center' }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Avatar
              rounded
              source={{
                uri: `${propic}`,
              }}
            />
            <Text style={{ color: 'white', marginLeft: 5 }}>Add story</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Post', { postimage: image })}
          style={{
            position: 'relative',
            alignItems: 'center',
            left: '20%',
            top: '20%',
          }}>
          <View style={{}}>
            <Text style={{ color: '#3498DB', fontSize: 23 }}> Post</Text>
          </View>
        </TouchableOpacity>
      </View>   
      </View>       
      ):
      (<View style={{justifyContent:'center',alignContent:'center',alignItems:'center',flex:1}}>
      <ActivityIndicator size="small" color="white"/>
      </View>)}
    
      
    </View>
  );
}
export default Cameraview;
