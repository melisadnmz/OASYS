import React,{useState} from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Linking} from "react-native";
import  {Card, Input, Divider} from 'react-native-elements';
import Icon from "react-native-vector-icons/Entypo";
import * as firebase from "firebase";
import Avatar from 'react-native-user-avatar';
import { connect } from "react-redux";
import {watchUserInfo, wathUserClasses, watchStudentAssignments,watchStudentList} from '../../redux/app-redux'

const mapStateToProps = (state) => {
  return {
    classCode: state.classCode,
    studentAsignmentList: state.studentAsignmentList,
    studentList: state.studentList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchUserInfo: (email) => {dispatch(watchUserInfo(email))},
    wathUserClasses: (email) => {dispatch(wathUserClasses(email))},
    watchStudentAssignments: (classCode) => {dispatch(watchStudentAssignments(classCode))},
    watchStudentList: (classCode) => {dispatch(watchStudentList(classCode))},
  }
}

  const LecturerAssignment = (props) => {

    const total = props.studentList.length;
    const submitted = props.studentAsignmentList.length;
    const percentage = props.studentList.length==0 ? 0 : submitted / total

    const dowloandFile = (fileName) =>{
      var ref = firebase.storage().ref().child("StudentAssignments/" + fileName);
      ref.getDownloadURL().then(function(url) {
          Linking.canOpenURL(url).then(supported => {
              if (supported) {
                Linking.openURL(url);
              } else {
                console.log("Don't know how to open URI: " + url);
              }
            });
          
          console.log(url);
      }, function(error){
          console.log(error);
      });

  }

    const Post = ({data}) => {
      return(
      <Card containerStyle={{ margin: 20, borderRadius:10, width:'90%'}}>
          <View style={{ flexDirection: 'row' }}>
            <Avatar 
              style={{ marginBottom: 10, marginRight: 5 }}
              name= {data.studentName}
            />
             <Text style={{ fontSize: 15,marginTop:5}}> {data.studentName} </Text>
           </View>
          <Divider style={{ backgroundColor: 'black', marginVertical:10,marginTop:-5 }} />
          <TouchableOpacity  style={{}} onPress={() => {dowloandFile(data.name)}}>
            <Card 
                containerStyle={{ borderRadius:40, marginLeft:15, marginTop: 5}}
                wrapperStyle={{flexDirection:'row'}}
                >
                <Text style={{marginLeft:10}}> {data.name} </Text>
                <Icon name="download" style={styles.icon1}></Icon>
            </Card>  
        </TouchableOpacity>  
      </Card> 
       );
    }

    return (
      <View style={styles.container}>
        <Card containerStyle={{borderRadius: 10}}>
         <Text style={{marginLeft: 150,fontSize:15}}>Report</Text>
         <Text>Total student: {total} {'\n'}Number of submitted assignment: {submitted}</Text>
          <View style={{ flexDirection: "row", backgroundColor: "lightgray", borderRadius: 4, overflow: 'hidden', margin:20}}>
           <View style={{ flex: percentage, height: 10,  backgroundColor: "red" }} />
             <View style={{ flex: 1 - percentage }} />
          </View>
          <Text style={{marginLeft: 150, marginTop: -10, fontSize:15}} >%{percentage * 100}</Text>
        </Card>
        <FlatList
        contentContainerStyle={{ paddingBottom: 20}}
          data={props.studentAsignmentList}
          renderItem={({item}) => <Post data={item} /> }
          keyExtractor={post => post.name}
        />
         
      </View>
    );
  }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
        },
        icon1: {
            color: "rgba(128,128,128,1)",
            fontSize: 25,
            position: 'absolute',
            marginLeft: 240,
            
          },
        icon2: {
            color: "rgba(128,128,128,1)",
            fontSize: 40,
            position: 'absolute'
          },
        });
  
        export default connect(mapStateToProps, mapDispatchToProps)(LecturerAssignment);