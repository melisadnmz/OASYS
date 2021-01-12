import React, {useState} from "react";
import { Text, View, StyleSheet, Alert, TextInput} from "react-native";
import  {Card, Input, Avatar, Divider} from 'react-native-elements';
import Button from "react-native-button";
import * as firebase from "firebase";
import { connect } from "react-redux";
import {watchUserInfo, wathUserClasses} from '../../redux/app-redux'

const mapStateToProps = (state) => {
  return {
    classCode: state.classCode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchUserInfo: (email) => {dispatch(watchUserInfo(email))},
    wathUserClasses: (email) => {dispatch(wathUserClasses(email))}
  }
}


  const EditClass = (props) => {
    
    const [className, setclassName] = useState("");
    const [classField, setclassField] = useState("");
    const [newClassName, setNclassName] = useState("");
    const [newClassField, setNclassField] = useState("");

    ////////////////// find correct class
    async function findClass(){

      const classesRef = firebase.database().ref('Classes');
      const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
      query.once('value').then(snapshot => {
          snapshot.forEach(child => {
            setclassName(child.child("className").val());
            setclassField(child.child("classField").val());
          })

      })
    }

    findClass();

    async function edittedClass(){

      const classesRef = firebase.database().ref('Classes');
      const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
      query.once('value').then(snapshot => {
          snapshot.forEach(child => {
            const ref = firebase.database().ref().child("Classes/" + child.key)
            .update({
              className: newClassName,
              classField: newClassField
            })
          })
      })
  }

    return (
      <View>
        <Card containerStyle={{borderRadius:10, marginTop: 30}}>
          <Text style={{fontSize:18}}>Class Name:</Text>
          <Card containerStyle={{marginLeft: 0,borderRadius:10, width:'100%', height: 80, marginBottom:10}}>
            <Input placeholder={className}
             value = {newClassName}
             onChangeText={newClassName => setNclassName(newClassName)}
            />
          </Card>
          <Text style={{fontSize:18}}>Class Field:</Text>
          <Card containerStyle={{marginLeft: 0, marginTop: 10,borderRadius:10, width:'100%', height: 80}}>
            <Input placeholder={classField}
            value = {newClassField}
            onChangeText={newClassField => setNclassField(newClassField)}
            />
          </Card>
         <View styles={{height:50, width:50}}>
             <Button containerStyle={styles.buttonContainer} style={{color: '#708090',fontWeight: "bold", }}  
              onPress={() => {
              edittedClass()
              Alert.alert('Class properties changed successfully')
              }
              }>
                Save Changes
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
  
    export default connect(mapStateToProps, mapDispatchToProps)(EditClass);