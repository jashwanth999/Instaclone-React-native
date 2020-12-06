import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Button, Text } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth, db } from './firebase.js';
import firebase from '@firebase/app';
function Userlist2({ username, id, navigation, propic, imageid }) {
  const user = auth.currentUser;
  const [image, setImage] = useState(null);
  const [sent,setSent]=useState(false)
  const [video,setvideo]=useState(null)
  useEffect(() => {
    async function fetchdata()
    {
 try {
      db.collection('images')
        .doc(imageid)
        .onSnapshot((doc) => {
          setImage(doc.data().photourl);
        });
    } catch (error) {
      console.log(error);
    }
    }
    fetchdata()
   
  }, []);
    useEffect(() => {
    async function fetchdata()
    {
 try {
      db.collection('images')
        .doc(imageid)
        .onSnapshot((doc) => {
          setvideo(doc.data().videourl);
        });
    } catch (error) {
      console.log(error);
    }
    }
    fetchdata()
   
  }, []);
  const send = () => {
    if(image)
    {
            db.collection('messages')
      .add({
        message: '',
        user_id_1: user?.uid,
        user_id_2: id,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        chatimage: image,
        video:null
      })
      .then(() => {
        setSent(true)
      });
    }
    else{
      
            db.collection('messages')
      .add({
        message: '',
        user_id_1: user?.uid,
        user_id_2: id,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        chatimage: null,
        video:video
      })
      .then(() => {
        setSent(true)
      });

    }
    
  };

  return (
    <View style={{ backgroundColor: 'black' }}>
      <ListItem containerStyle={{ backgroundColor: 'black' }}>
        <Avatar
          size="medium"
          rounded
          source={{
            uri: `${propic}`,
          }}
        />
        <ListItem.Content>
          <ListItem.Title
            style={{ color: 'white', fontSize: 20, marginLeft: 10 }}
            onPress={() =>
              navigation.navigate('chatfeeds', {
                roomid: id,
                username: username,
                propic: propic,
              })
            }>
            {username}
          </ListItem.Title>
        </ListItem.Content>
        {!sent?(
          <TouchableOpacity onPress={send}>
          <View
            style={{
              width: 70,
              borderRadius: 5,
              backgroundColor: '#24a0ed',
              height: 30,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
                position: 'relative',
                left: 9,
                top: 2,
              }}>
              {' '}
              send
            </Text>
          </View>
        </TouchableOpacity>
        ):(
          <TouchableOpacity >
          <View
            style={{
              width: 70,
              borderRadius: 5,
              backgroundColor: '#383838',
              height: 30,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
                position: 'relative',
                left: 9,
                top: 2,
              }}>
              {' '}
              sent
            </Text>
          </View>
        </TouchableOpacity>
        )}
        
      </ListItem>
    </View>
  );
}
export default Userlist2;
