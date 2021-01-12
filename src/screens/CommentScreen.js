import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import { Card, Divider, Input, Button } from 'react-native-elements';
import Avatar from 'react-native-user-avatar';
import Feather from 'react-native-vector-icons/Feather';
import * as firebase from "firebase";
import { connect } from "react-redux";
import {watchComments} from '../redux/app-redux'
import Entypo from 'react-native-vector-icons/Entypo';

const mapStateToProps = (state) => {
  return {
    classCode: state.classCode,
    postKey: state.postKey,
    username: state.username,
    email: state.email,
    comments: state.comments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchComments: (classCode, postKey) => {dispatch(watchComments(classCode, postKey))}
  }
}


const CommentScreen = (props) => {
  
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    props.watchComments(props.classCode, props.postKey)
    setRefreshing(false)
  }

    const [isModalVisible, setModalVisible] = useState(false);
    
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [comment, setComment] = useState("");

    const [commentKey, setCommentKey] = useState("");
    const [postKey, setPostKey] = useState("");
    

    const deleteComment = (postKey, commentKey) => {

      const classesRef = firebase.database().ref('Classes');
      const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
      query.once('value').then(snapshot => {
          snapshot.forEach(child => {
              firebase.database().ref()
              .child("Classes/" + child.key + "/Announcements/" + postKey + '/Comments/' + commentKey)
              .once('value', (snapshot) => {
                snapshot.ref.remove()
          })
        })
      }).then(
        () => {
          props.watchComments(props.classCode, props.postKey)
          setModalVisible(!isModalVisible);
        }
      )
      
    };

    const postComment = (key) => {
    
        if(comment == ''){
          alert('Please enter commment')
          return;
        }
    
        const classesRef = firebase.database().ref('Classes');
        const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
        query.once('value').then(snapshot => {
            snapshot.forEach(child => {
                var ref = firebase.database().ref()
                .child("Classes/" + child.key + "/Announcements/" + key + '/Comments')

                var commentKey = ref.push().getKey()
                ref.child(commentKey).set(
                  {
                    comment: comment,
                    username: props.username,
                    email: props.email,
                    postKey: key,
                    commentKey: commentKey
                  }
                ).then(
                  () => {
                  props.watchComments(props.classCode, key)}
                )

            })
        })
    
      }

      const CommentButton = ({data}) => {
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
                  onPress={ () => {
                    setCommentKey(data.commentKey)
                    setPostKey(data.postKey)
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

    const Comment = ({data}) => {
        return(
            <Card containerStyle={{ margin: 20, borderRadius:10, maxWidth: '90%', width:400 }}>
                <View style={{ flexDirection: 'row' , justifyContent:'space-between'  }}>
                  <View style={{ flexDirection: 'row' }}>
                      <Avatar 
                          style={{ marginRight: 5 }}
                          name= {data.username}
                      />
                      <Text style={{ fontSize: 19, }}> {data.username} </Text>
                  </View>
                  <CommentButton data={data}/>
                </View>
                <Divider style={{ backgroundColor: 'black', marginVertical: 10 }} />
                <Text style={{ marginVertical: 10, fontSize: 17 }}> {data.comment} </Text>
            </Card>
        );
    };

    return(
        <View style={styles.container}>
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
                    title="Delete Comment" 
                    onPress={() => {deleteComment(postKey, commentKey)}} 
                  />
                  <Button 
                          buttonStyle={{backgroundColor: "red", width:150}} 
                          title='Cancel' 
                          onPress={toggleModal} 
                  />
              </View>
            </View>
          </Modal>
            <FlatList      
                data={props.comments}
                renderItem={({item}) => <Comment data={item} /> }
                keyExtractor={post => post.commentKey}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />   
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:10 }}>
            <Input 
              placeholder='Add Comment' 
              containerStyle={{ width: '90%' }}
              onChangeText={comment => setComment(comment)}
            />
            <Button
              onPress={() => postComment(props.postKey)}
              icon={
                <Feather name='send' size={21} />
              }
            />
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
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
    },
}); 

export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen);