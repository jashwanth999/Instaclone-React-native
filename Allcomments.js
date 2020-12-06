import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Card, ListItem, Button, Icon, Header } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import { db, auth } from './firebase.js';
import firebase from '@firebase/app';
import Comments from './Comments.js';
import Userlist2 from './Userlist2.js'
import { BottomSheet } from 'react-native-btr';
function Allcomments({ route, navigation }) {
  const user = auth.currentUser;
  const { id, username, mainpropic } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [propic, setPropic] = useState(null);
  const [visible, setVisible] = useState(false);
  const [book,setBook]=useState(false)
  const imageid=id;
  const [using,setUsers]=useState([])
  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  const [isvisible, setisVisible] = useState(false);

  const toggleOverlay = () => {
    setisVisible(!isvisible);
  };
  useEffect(() => {
    if (user?.uid) {
      db.collection('users')
        .doc(user?.uid)
        .onSnapshot((doc) => {
          setPropic(doc.data().propic);
        });
    }
  }, [user?.uid]);
  const sendcomment = () => {
    db.collection('images').doc(id).collection('comments').add({
      comment: comment,
      username: user?.displayName,
      propic: propic,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };
  useEffect(() => {
    try {
      if (id) {
        db.collection('images')
          .doc(id)
          .collection('comments')
          .orderBy('timestamp', 'desc')
          .onSnapshot((snapshot) => {
            setComments(
              snapshot.docs.map((doc) => ({
                rid: doc.id,
                value: doc.data(),
              }))
            );
          });
      }
    } catch (error) {
      alert(error);
    }
  }, [id]);
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

  return (
    <View style={styles.container}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
          borderBottomColor: 'none',
        }}
        placement="left"
        leftComponent={
          <MaterialCommunityIcons
            onPress={() => navigation.goBack()}
            name={'arrow-left'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={{
          text: 'comments',
          style: { color: 'white', fontSize: 23, marginRight: 30 },
        }}
        rightComponent={
          <MaterialCommunityIcons
            onPress={toggleBottomNavigationView}
            name={'telegram'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
      />

      <ScrollView style={{ height: '30%' }}>
        {comments.map(({ value, rid }) => (
          <Comments
            key={rid}
            id={rid}
            comment={value.comment}
            propic={value.propic}
            username={value.username}
            mainpropic={mainpropic}
            imageid={id}
          />
        ))}
      </ScrollView>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderColor: 'gray',
          position: 'absolute',
          width: '100%',
          alignItems: 'center',
          alignContent: 'center',
          backgroundColor: '#383838',
          bottom: 0,
          height: 50,
        }}>
        <View
          style={{ margin: 1, flex: 1, display: 'flex', flexDirection: 'row' }}>
          <View style={{ margin: 5 }}>
            <Avatar
              rounded
              source={{
                uri: `${mainpropic}`,
              }}
            />
          </View>
          <View style={{ width: '60%', margin: 3 }}>
            <TextInput
              style={{
                height: 40,
                outline: 'none',
                marginLeft: 6,
                color: 'white',
                fontSize: 18,
              }}
              onChangeText={(text) => setComment(text)}
              value={comment}
              placeholder="write a comment....."
              placeholderTextColor="white"
              textColor="white"
            />
          </View>
        </View>

        <TouchableOpacity style={{}} onPress={sendcomment}>
          <Text style={{ color: '#24a0ed', fontSize: 20 }}>Post</Text>
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
const styles = {
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  field_container: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
  },
  text_input: {
    height: 40,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#eaeaea',
    padding: 5,
  },
  loading_text: {
    alignSelf: 'center',
  },
  inner: {
    flex: 1,
  },
};

export default Allcomments;
