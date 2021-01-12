import React, {useState} from "react";
import { Text, View, StyleSheet, Alert} from "react-native";
import  {Card, Input, Avatar, Divider} from 'react-native-elements';
import Button from "react-native-button";
import * as firebase from "firebase";
import { connect } from "react-redux";
import {watchUserInfo, wathUserClasses} from '../../redux/app-redux'

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


  const CreateClass = (props) => {

    const [className, setClassName] = useState("");
    const [classField, setClassField] = useState("");
    const [classCode, setClassCode] = useState(Math.random().toString(36).substring(7));

    const rootRef = firebase.database().ref();
    const classesRef = rootRef.child("Classes");

  
    async function createClass (className, classField){

      if(className.trim().length == 0 || classField.trim().length == 0){
        Alert.alert("Please enter valid input");
        return;
      }

      const userRef = firebase.database().ref("User");
      const query = userRef.orderByChild('email').equalTo(props.email)

      Object.values(props.userInfo).forEach(child => {
        let r = Math.random().toString(36).substring(7);
        setClassCode(r);
        classesRef.push({
          className: className, 
          classField: classField, 
          classCode: classCode,
          instructure: child.username
        })
      .then(
            query.once('value').then(user => {  
            user.forEach(userChild => {
              userChild.child('classes').ref.push({classCode: classCode})      
            })
          })
      )
      .then(
        Alert.alert(
          "Class created",
          "You have successfully created class",
          [
          { text: "OK", onPress: () => {
              props.wathUserClasses(props.email)
              props.navigation.navigate('Screens')
          }}
          ],
          { cancelable: false }
      )
      );
      })

    }
    
    
    return (
      <View>
          <Card containerStyle={{borderRadius:10, marginTop: 30}}>
          <Text style={{fontSize:18}}>Class Name:</Text>
       <Card containerStyle={{marginLeft: 0, marginTop: 10,borderRadius:10, width:'100%', height: 70}}>
       <Input placeholder={"Enter class name"} value={className} onChangeText={className => setClassName(className)}/>
       </Card>
       <Text style={{fontSize:18, marginTop: 20}}>Class Field:</Text>
       <Card containerStyle={{marginLeft: 0, marginTop: 10,borderRadius:10, width:'100%', height: 70}}>
       <Input placeholder={"Enter class field"} value={classField} onChangeText={classField => setClassField(classField)}/>
       </Card>
      
      
         <View styles={{height:50, width:50}}>
             <Button containerStyle={styles.buttonContainer} style={{color: '#708090',fontWeight: "bold", }}  
              onPress={() => createClass(className, classField)}>
                Create Class
            </Button>
        </View> 
        </Card>
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
            marginLeft: 100
          }
    });
  
     export default connect(mapStateToProps, mapDispatchToProps)(CreateClass);