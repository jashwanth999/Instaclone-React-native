import React,{useState,useEffect} from 'react'
import { View, Image,Text,Button } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements' 
import {db,auth} from './firebase.js'

function ActivityFollowers({username,userid,navigation,propic})
{
  const user=auth.currentUser
  const [following,setFollowing]=useState([])
  useEffect(() => {
    db.collection("users")
    .doc(user.uid)
    .collection("following")
      .onSnapshot((snapshot) => {
        setFollowing(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data()
          }))
        );
      });
  }, []);
  
  
  return(
    <View style={{backgroundColor:'black'}} >
  
        <ListItem containerStyle={{backgroundColor:"black"}} >
        <Avatar size="medium"
         rounded  source={{
      uri: `${propic}`,
    }} />
        <ListItem.Content >
        <View style={{display:'flex',flexDirection:'row'}}>
          <ListItem.Title style={{color:'white'}}>{username}</ListItem.Title>
          <Text style={{color:'white',marginLeft:10,margin:2,fontSize:16}}>following you  </Text>
          </View>
        </ListItem.Content>
      </ListItem>
     
     

      
   
      

 
      
      </View>

  )
}
export default  ActivityFollowers