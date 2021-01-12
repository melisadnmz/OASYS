import React, {useState} from 'react';
import {Text, View,StyleSheet,TextInput, TouchableHighlight, Alert} from 'react-native';
import  {Card, Divider} from 'react-native-elements';
import Icon from "react-native-vector-icons/EvilIcons";
import Avatar from 'react-native-user-avatar';
import { connect } from "react-redux";
import {watchAnnouncements} from '../../redux/app-redux'
import * as firebase from "firebase";

const mapStateToProps = (state) => {
  return {
      userInfo: state.userInfo,
      username: state.username,
      classCode: state.classCode,
      email: state.email
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchAnnouncements: (classCode) => {dispatch(watchAnnouncements(classCode))}
  }
}

const PostBulkMessage = (props) => {

  const [post, setPost] = useState('');
   
  const handlePost = () => {

    const classesRef = firebase.database().ref('Classes');
    const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
    query.once('value').then(snapshot => {
        snapshot.forEach(child => {
            const ref = firebase.database().ref()
            .child("Classes/" + child.key + "/Announcements")

            var key = ref.push().getKey()
            ref.child(key).set(
              {
                post: post,
                username: props.username,
                email: props.email,
                key: key
              }
            ).then(
              Alert.alert(
                "Posted",
                "You have successfully posted your post",
                [
                { text: "OK", onPress: () => {
                    props.watchAnnouncements(props.classCode)
                    props.navigation.goBack()
                }}
                ],
                { cancelable: false }
              )
            )
        })
    })

  }

  return (
    <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
            <Avatar 
              style={{ marginBottom: 10, marginRight: 5 }}
              name= {props.username}
            />
            <Text style={{ fontSize: 20, }}> 
              {props.username}
            </Text>
          </View>
        <Divider style={{ backgroundColor: 'black' }} />
        <Card containerStyle={{height:200, marginTop:20}}>
            <TextInput 
                placeholder = "Write Your Question" 
                underlineColorAndroid='transparent'
                value={post}
                onChangeText={post => setPost(post)}
              />
        </Card>
        <TouchableHighlight   underlayColor='transparent' onPress={handlePost}>
            <View style={{alignItems:'flex-end', marginRight:10}}>
                <Icon name="sc-telegram" style={styles.icon}></Icon>
            </View>
        </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
     marginTop:30,
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 50,
    marginTop: 10,
  },
  userText:{
    marginLeft:60, 
    marginTop: 25,
    fontSize:20, 
    color:'grey'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostBulkMessage);