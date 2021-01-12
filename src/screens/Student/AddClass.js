import React, { useState, Children } from "react";
import { Text, View, StyleSheet, Alert} from "react-native";
import  {Card, Input, Avatar, Divider} from 'react-native-elements';
import Button from "react-native-button";
import { connect } from "react-redux";
import {watchUserInfo, wathUserClasses} from '../../redux/app-redux'
import * as firebase from 'firebase'

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    email: state.email
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchUserInfo: (email) => {dispatch(watchUserInfo(email))},
    wathUserClasses: (email) => {dispatch(wathUserClasses(email))}
  }
}

  const AddClass = (props) => {

    const [classExists, setClassExists] = useState(false); 
    const [classCode, setClassCode] = useState({ value: ""}); 
    
    const addClass = () => {
      //checks if the entered class code exists in the database
      if(classCode.value != ''){
        firebase.database().ref('Classes').orderByChild('classCode').equalTo(classCode.value).once('value').then(actualClass => {
          if(actualClass.exists()){
            const userRef = firebase.database().ref("User");
            const query = userRef.orderByChild('email').equalTo(props.email)
            query.once('value').then(user => {  
            user.forEach(userChild => {
              userChild.child('classes').forEach(classesChild => {
                if(classesChild.val().classCode == classCode.value){
                  setClassExists(true)
                }
              })
              if(classExists == false){
                userChild.child('classes').ref.push({
                    classCode: classCode.value,
                    attendance: 0,
                  })
                Alert.alert(
                  "Class added",
                  "You have successfully added class",
                  [
                  { text: "OK", onPress: () => {
                      props.wathUserClasses(props.email)
                      props.navigation.navigate('Screens')
                  }}
                  ],
                  { cancelable: false }
              )
              }else{
                Alert.alert('Class already exists!')
              }            
            })
          })
        }
        else{
          Alert.alert('Class with this class code does not exists!')
        }
        })
      }else{
        Alert.alert('Please enter a class code!')
      }
      
    }

    return (
      <View>
       <Card containerStyle={{ margin: 20, marginTop: 40,borderRadius:10, width:'90%'}}>
       <Input 
          placeholder='Enter class code'
          value={classCode}
          onChangeText={classCode => setClassCode({ value: classCode})}
       />
       </Card>
         <View styles={{height:50, width:50}}>
             <Button containerStyle={styles.buttonContainer} style={{color: '#708090',fontWeight: "bold", }}  
              onPress={addClass}>
                Join Class
            </Button>
        </View> 
      </View>
    );
  }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
        },
        buttonContainer: {
            width: 130,
            backgroundColor: '#ff5a66',
            borderRadius:10,
            padding: 10,
            marginTop: 30,
            marginLeft: 140
          }
    });
  
     export default connect(mapStateToProps, mapDispatchToProps)(AddClass);