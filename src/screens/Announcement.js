import React, {useState} from "react";
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ScrollView, RefreshControl, Modal } from "react-native";
import { Card, Input, Divider, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Avatar from 'react-native-user-avatar';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from "react-redux";
import {watchAnnouncements, setPostKey, watchComments} from '../redux/app-redux'
import * as firebase from "firebase";

const mapStateToProps = (state) => {
  return {
    classCode: state.classCode,
    posts: state.posts,
    username: state.username,
    email: state.email
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchAnnouncements: (classCode) => {dispatch(watchAnnouncements(classCode))},
    setPostKey: (postKey) => {dispatch(setPostKey(postKey))},
    watchComments: (classCode, postKey) => {dispatch(watchComments(classCode, postKey))},

  }
}


const Announcement = (props) => {
  
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    props.watchAnnouncements(props.classCode)
    setRefreshing(false)
  }

  const [postKey, setPostKey] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const deletePost = (key) => {

      const classesRef = firebase.database().ref('Classes');
      const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
      query.once('value').then(snapshot => {
          snapshot.forEach(child => {
              firebase.database().ref()
              .child("Classes/" + child.key + "/Announcements/" + key)
              .once('value', (snapshot) => {
                snapshot.ref.remove()
          })
        })
      }).then(
        () => {
          props.watchAnnouncements(props.classCode)
          setModalVisible(!isModalVisible);
        }
      )
      
    };

    const PostButton = ({data}) => {
        if(props.email == data.email){
          return(
            <Button
                containerStyle={styles.button}
                type='clear'
                icon={
                  <Entypo 
                      style={styles.icon}
                      name='dots-three-horizontal' 
                      size={15} 
                  />
                }
                  onPress={() => {
                    setPostKey(data.key)
                    toggleModal()
                  }}
            />
          )
        } else {
          return (
            <View>

            </View>
          )
        }
    }

  const Post = ({data}) => {
    return(
      <Card containerStyle={{ margin: 20, borderRadius:10 }}>
          <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>
            <View style={{ flexDirection: 'row'}}>
              <Avatar 
                style={{ marginBottom: 10, marginRight: 5 }}
                name= {data.username}
              />
              <Text style={{ fontSize: 20, }}> {data.username} </Text>
            </View>
            <PostButton data={data}/>
          </View>
          <Divider style={{ backgroundColor: 'black' }} />
          <Text style={{ marginVertical: 10, fontSize: 17 }}> {data.post} </Text>
          <Divider style={{ backgroundColor: 'black' }} />     
          <TouchableOpacity 
              style={{ margin: 10 }} 
              onPress={() => {
                props.setPostKey(data.key)
                props.watchComments(props.classCode, data.key)
                props.navigation.navigate('Comments')
              }}
          >
            <Text>Comments</Text>
          </TouchableOpacity>
        </Card>
    );
  }

  const DisplayPost = () => {
      if(props.posts.length != 0){
        return(
          <View style={{flex:1}}>
              <FlatList 
                contentContainerStyle={{ paddingBottom: 20}}
                data={props.posts}
                renderItem={({item}) => <Post data={item} /> }
                keyExtractor={post => post.key}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              /> 
          </View>  
        );
      }else{
        return(
          <View style={{flex:1}}>
            <ScrollView
              contentContainerStyle={{flex:1}}
              refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
              }
            >
            <Card containerStyle={{ margin: 20, borderRadius:10, padding: 20}}>
            <Text style={{fontSize:30, textAlign: 'center'}}>
              Nothing to show
            </Text>
          <Divider style={{ backgroundColor: 'black', marginVertical:10, borderWidth:1 }} />     
            <Text style={{fontSize:20, textAlign: 'center'}}>
              There is no post that posted yet!
            </Text>
            </Card>
            </ScrollView>
          </View>
        );
      }
  } 

  return (
    <View style={styles.container}>
      <View style={{ margin: 30, marginBottom: 0 }}>
          <Input 
            placeholder='Share your question with class' 
            leftIcon={
              <Icon name='question' size={24} color='black'/>
            }  
            onTouchStart={() => props.navigation.navigate('Post')}
            showSoftInputOnFocus={false}
          />
      </View>
      <DisplayPost />
      <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <Button 
                    containerStyle={{marginBottom:15}} 
                    buttonStyle={{width:150}}
                    title="Delete Post" 
                    onPress={() => {deletePost(postKey)}} 
                  />
                  <Button 
                          buttonStyle={{backgroundColor: "red", width:150}} 
                          title='Cancel' 
                          onPress={toggleModal} 
                  />
              </View>
            </View>
          </Modal>
    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    height: 40,
    width: 40,
  },
  icon:{
      position: 'absolute',
  },
  button:{
      position: 'absolute',
      right: 5,
              top: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Announcement);