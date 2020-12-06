import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView,TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import { db } from './firebase.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-native-elements';
import {auth} from './firebase.js';
import { BottomSheet } from 'react-native-btr';
import { Overlay } from 'react-native-elements';
import Userlist2 from './Userlist2.js';
import { Video } from 'expo-av';
function Profilepost({ route, navigation }) {
  const {
    imageurl,
    id,
    username,
    caption,
    piclikes,
    timestamp,
    propic,
    mainpropic,
    videourl
  } = route.params;
  const [likes, setLikes] = useState(0);
  const [alllikes, setAlllikes] = useState(0);
   const [book,setBook]=useState(false)
    const [visible, setVisible] = useState(false);
   const user=auth.currentUser
     const [using, setUsers] = useState([]);
     const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  const [isvisible, setisVisible] = useState(false);

  const toggleOverlay = () => {
    setisVisible(!isvisible);
  };
   useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            rid: doc.id,
            users: doc.data(),
          }))
        );
      });
  }, []);
  useEffect(() => {
    if (id) {
      db.collection('images')
        .doc(id)
        .onSnapshot((doc) => {
          setAlllikes(doc.data().likes);
        });
    }
  }, [id]);

  const set = () => {
    setLikes(1);
    if (alllikes) {
      db.collection('images')
        .doc(id)
        .update({
          likes: alllikes + 1,
        });
    } else {
      db.collection('images').doc(id).update({
        likes: 1,
      });
    }
  };
  const dislike = () => {
    setLikes(0);
    if (alllikes <= 0) {
      db.collection('images').doc(id).update({
        likes: 0,
      });
    } else {
      db.collection('images')
        .doc(id)
        .update({
          likes: alllikes - 1,
        });
    }
  };
  const bookmark=()=>
  {
    db.collection("users").doc(user.uid).collection("saved").doc(id).set({
      imageurl:imageurl,
      imageid:id
    })
    .then(()=>
    {
      setBook(true)
    })
  
  }
const unbookmark=()=>
{ 
db.collection("users").doc(user.uid).collection("saved").doc(id).delete().then(()=>
{
  setBook(false)
})
}


  return (
    <View style={{ backgroundColor: 'black', height: "100%" }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        placement="left"
        leftComponent={
          <Icons
            onPress={() => navigation.goBack()}
            name={'arrow-back'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={{
          text: 'Post',
          style: { color: 'white', fontSize: 23, marginRight: 30 },
        }}
      />
      <View style={{flex:0.75}}>
      <Overlay isVisible={isvisible} onBackdropPress={toggleOverlay}>
        <TouchableOpacity
          onPress={() => db.collection('images').doc(id).delete()}>
          <View>
            <Text style={{ color: 'red' }}>delete</Text>
          </View>
        </TouchableOpacity>
      </Overlay>
      <View
        style={{ display: 'flex', flexDirection: 'row', padding: 10, flex: 1 }}>
        <Avatar
          rounded
          source={{
            uri: `${propic}`,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              marginTop: 5,
              marginLeft: 8,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {username}
          </Text>
        </View>

        <MaterialIcons
          onPress={toggleOverlay}
          name="more-vert"
          size={24}
          color="white"
        />
      </View>
   {imageurl?(
     <Card.Image
        style={{ height: 300, resizeMode: 'cover' }}
        source={{
          uri: `${imageurl}`,
        }}
      />
   ):(<Video
  source={{ uri: `${videourl}` }}
  rate={1.0}
  volume={1.0}
  isMuted={false}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: "100%", height: 300 }}
/>)}
      
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 10,
          marginLeft: 8,
          flex: 1,
        }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {likes ? (
            <MaterialCommunityIcons
              onPress={dislike}
              style={{ marginRight: 12, color: 'red' }}
              name="heart"
              size={30}
              color="red"
            />
          ) : (
            <MaterialCommunityIcons
              onPress={set}
              style={{ marginRight: 12, color: 'white' }}
              name="heart-outline"
              size={30}
              color="black"
            />
          )}

          <MaterialCommunityIcons
            onPress={() =>
              navigation.navigate('Allcomments', { id: id, username: username, mainpropic: mainpropic, })
            }
            style={{ marginRight: 12, color: 'white' }}
            name="chat-outline"
            size={30}
            color="white"
          />
          <MaterialCommunityIcons
            onPress={toggleBottomNavigationView}
            name="telegram"
            size={30}
            color="white"
          />
        </View>
         {book?(
           <MaterialCommunityIcons onPress={unbookmark}
          style={{ marginLeft: '59%' }}
          name="bookmark"
          size={30}
          color="white"
        />
         ):(
           <MaterialCommunityIcons onPress={bookmark}
          style={{ marginLeft: '59%' }}
          name="bookmark-outline"
          size={30}
          color="white"
        />
         )}
        
      </View>
      <View style={{ marginLeft: 12 }}>
        <Text style={{ color: 'white' }}>{piclikes} likes</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 10,
          marginLeft: 12,
        }}>
        <Text style={{ fontWeight: 'bold', marginRight: 10, color: 'white' }}>
          {username}
        </Text>
        <Text style={{ color: 'white' }}>{caption}</Text>
      </View>
      <Text
        onPress={() =>
          navigation.navigate('Allcomments', {
            id: id,
            username: username,
            mainpropic: mainpropic,
          })
        }
        style={{ color: 'grey', marginLeft: 12 }}>
        view all comments
      </Text>
      <Text style={{ color: 'grey', marginLeft: 12 }}>{timestamp}</Text>
      

      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}>
        <View
          style={{
            width: '100%',
            height: 300,
            backgroundColor: 'black',
            borderRadius: 25,
          }}>
          <TouchableOpacity
            onPress={() => setisVisible(false)}
            style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={{
                width: 50,
                height: 10,
                backgroundColor: 'gray',
                borderRadius: 15,
              }}></View>
          </TouchableOpacity>
          <View style={{ marginTop: 10 }}>
            <ScrollView style={{ height: 250 }}>
              {using.map(({ rid, users }) => (
                <Userlist2
                  key={rid}
                  id={rid}
                  username={users.username}
                  navigation={navigation}
                  user={user}
                  propic={users.propic}
                  imageid={id}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </BottomSheet>
    </View>

</View>
  );
}
export default Profilepost;
