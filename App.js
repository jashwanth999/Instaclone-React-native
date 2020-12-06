import React, { useState, useEffect } from 'react';
import { Button, Text, View, Header } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import Home from './Home.js';
import Edit from './Editprofile.js';
import Allcomments from './Allcomments.js';
import Profilepost from './Profilepost';
import Storyview from './Storyview.js';
import Userprofile from './Userprofile.js';
import Highlight from './Highlight.js';
import Activity from './Activity.js';
import Search from './Search.js';
import Followview from './FollowView.js';
import FollowingView from './FollwingView';
import { auth, db } from './firebase.js';
import Login from './Login.js';
import Register from './Register.js';
import Chatfeed from './Chatfeed.js';
import Profile from './Profile.js';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from './Chat.js';
import Post from './Post.js';
import SearchPeople from './SearchPeople.js';
import Cam from './Camera.js';
import Cam2 from './Camera2.js';
import Cameraview from './CameraView.js';
import Chatcamera from './Chatcamera.js';
import { Avatar } from 'react-native-elements';
import Splashscreen from './Splashscreen.js';
import Videos from './Video.js'
import Save from './Save.js'
const Tab = createBottomTabNavigator();

console.disableYellowBox = true;
function MyTabs() {
  const user = auth.currentUser;
  const [propic, SetPropic] = useState(null);
  async function fetchdata() {
    try {
      db.collection('users')
        .doc(user.uid)
        .onSnapshot((doc) => {
          SetPropic(doc.data().propic);
        });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: 'white',
        showLabel: false,
        keyboardHidesTabBar: true,
        style: { backgroundColor: 'black' },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-box-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Avatar
              rounded
              source={{
                uri: `${propic}`,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  const user = auth.currentUser;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

      }}>
      <Stack.Screen name="Login" component={Login} />
       <Stack.Screen name="mytabs" component={() => <MyTabs user={user} />} />
      
      <Stack.Screen name="splash" component={Splashscreen} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="chatfeeds" component={Chatfeed} />
      <Stack.Screen name="chat" component={Chat} />
      <Stack.Screen name="edit" component={Edit} />
      <Stack.Screen name="Allcomments" component={Allcomments} />
      <Stack.Screen name="profilepost" component={Profilepost} />
      <Stack.Screen name="storyview" component={Storyview} />
      <Stack.Screen name="userprofile" component={Userprofile} />
      <Stack.Screen name="highlight" component={Highlight} />
      <Stack.Screen name="followview" component={Followview} />
      <Stack.Screen name="followingview" component={FollowingView} />
      <Stack.Screen name="searchpeople" component={SearchPeople} />
      <Stack.Screen name="cam" component={Cam} />
      <Stack.Screen name="cam2" component={Cam2} />
      <Stack.Screen name="cameraview" component={Cameraview} />
      <Stack.Screen name="chatcamera" component={Chatcamera} />
       <Stack.Screen name="video" component={Videos} />
        <Stack.Screen name="save" component={Save} />

    </Stack.Navigator>
  );
}

export default function App() {
  const user = auth.currentUser;
  return (
    <NavigationContainer>
      <MyStack user={user} />
    </NavigationContainer>
  );
}
