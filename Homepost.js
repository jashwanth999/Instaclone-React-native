import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import { TextInput } from 'react-native';
import { db, auth } from './firebase.js';
import { BottomSheet } from 'react-native-btr';
import Userlist2 from './Userlist2.js';
import { Overlay } from 'react-native-elements';
import { Video } from 'expo-av';

function Homepost({
  imageurl,
  username,
  caption,
  navigation,
  id,
  propic,
  piclikes,
  timestamp,
  mainpropic,
  userid,
  videourl
}) {
  const [likes, setLikes] = useState(0);
  const [alllikes, setAlllikes] = useState(0);
  const [value, onChangeText] = React.useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isliked, setLiked] = useState(false);
  const [using, setUsers] = useState([]);
  const imageid = id;
  const user = auth.currentUser;
  const [visible, setVisible] = useState(false);
  const [book,setBook]=useState(false)
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
      .collection('messages')
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  }, []);
  useEffect(() => {
    try {
      if (id) {
        db.collection('images')
          .doc(id)
          .onSnapshot((doc) => {
            setAlllikes(doc.data().likes);
          });
      }
    } catch (e) {
      Alert.alert(e);
    }
  }, [id]);

  const set = () => {
    setLikes(1);
    if(imageurl)
    {
      if (alllikes) {
      db.collection('images')
        .doc(id)
        .update({
          likes: alllikes + 1,
        });
      db.collection('users').doc(userid).collection('likes').doc(id).set({
        likerid: user.uid,
        likername: user.displayName,
        likerpic: mainpropic,
        imageurl: imageurl,
        videourl:null
      });
      db.collection('users').doc(user.uid).collection('isliked').doc(id).set({
        isLiked: true,
      });
    } else {
      db.collection('images').doc(id).update({
        likes: 1,
      });
       db.collection('users').doc(userid).collection('likes').doc(id).set({
        likerid: user.uid,
        likername: user.displayName,
        likerpic: mainpropic,
        imageurl: imageurl,
        videourl:null
      });
     
      db.collection('users').doc(user.uid).collection('isliked').doc(id).set({
        isLiked: true,
      });
    }

    }
    else{
      if (alllikes) {
      db.collection('images')
        .doc(id)
        .update({
          likes: alllikes + 1,
        });
     db.collection('users').doc(userid).collection('likes').doc(id).set({
        likerid: user.uid,
        likername: user.displayName,
        likerpic: mainpropic,
        imageurl: null,
        videourl:videourl
      });
      db.collection('users').doc(user.uid).collection('isliked').doc(id).set({
        isLiked: true,
      });
    } else {
      db.collection('images').doc(id).update({
        likes: 1,
      });
    db.collection('users').doc(userid).collection('likes').doc(id).set({
        likerid: user.uid,
        likername: user.displayName,
        likerpic: mainpropic,
        imageurl: null,
        videourl:videourl
      });
      db.collection('users').doc(user.uid).collection('isliked').doc(id).set({
        isLiked: true,
      });
    }
    }
    
  };
  const dislike = () => {
    setLikes(0);
    if (alllikes <= 0) {
      db.collection('images').doc(id).update({
        likes: 0,
      });
      db.collection('users').doc(user.uid).collection('isliked').doc(id).set({
        isLiked: false,
      });
    } else {
      db.collection('images')
        .doc(id)
        .update({
          likes: alllikes - 1,
        });
      db.collection('users').doc(user.uid).collection('isliked').doc(id).set({
        isLiked: false,
      });
    }
  };
  const bookmark=()=>
  {
    if(imageurl)
    {
  db.collection("users").doc(user.uid).collection("saved").doc(id).set({
      imageurl:imageurl,
      imageid:imageid,
      videourl:null
    })
    .then(()=>
    {
      setBook(true)
    })
    }
    else{
       db.collection("users").doc(user.uid).collection("saved").doc(id).set({
      imageurl:null,
      imageid:imageid,
      videourl:videourl
    })
    .then(()=>
    {
      setBook(true)
    })
    }
  
  
  }
const unbookmark=()=>
{ 
db.collection("users").doc(user.uid).collection("saved").doc(id).delete().then(()=>
{
  setBook(false)
})
}


  return (
    <View>
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
       {!videourl?(
         <Image
        style={{ height: 300, resizeMode: 'cover' }}
        source={{
          uri: `${imageurl}`,
        }}
      />
       ):(
        <Video
  source={{ uri: `${videourl}` }}
  rate={1.0}
  volume={1.0}
  isMuted={false}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: "100%", height: 300 }}
/>
       )}
      
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
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderColor: 'gray',
          margin: 3,
          borderRadius: 40,
        }}>
        <View style={{ margin: 5 }}>
          <Avatar
            rounded
            source={{
              uri: `${mainpropic}`,
            }}
          />
        </View>
        <TouchableOpacity>
          <TextInput
            onTouchStart={() =>
              navigation.navigate('Allcomments', {
                id: id,
                username: username,
                mainpropic: mainpropic,
              })
            }
            style={{
              height: 40,
              borderColor: 'white',
              outline: 'none',
              marginLeft: 6,
            }}
            onChangeText={(text) => onChangeText(text)}
            value={value}
            placeholder="Add a comment.."
            placeholderTextColor="white"
          />
        </TouchableOpacity>
      </View>

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
            onPress={() => setIsVisible(false)}
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
              {using.map(({ id, users }) => (
                <Userlist2
                  key={id}
                  id={id}
                  username={users.username}
                  navigation={navigation}
                  user={user}
                  propic={users.userpropic}
                  imageid={imageid}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
export default Homepost;
