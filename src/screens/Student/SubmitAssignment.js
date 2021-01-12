import React,{useState}  from "react";
import { Text, View, StyleSheet,TouchableOpacity, Alert, Button} from "react-native";
import  {Card, Input} from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import * as firebase from "firebase";
import { connect } from "react-redux";
import {watchUserInfo, wathUserClasses, watchStudentAssignments} from '../../redux/app-redux'
import DocumentPicker from 'react-native-document-picker';

const mapStateToProps = (state) => {
    return {
      classCode: state.classCode,
      assignmentKey: state.assignmentKey,
      userInfo: state.userInfo
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      watchUserInfo: (email) => {dispatch(watchUserInfo(email))},
      wathUserClasses: (email) => {dispatch(wathUserClasses(email))},
      watchStudentAssignments: (classCode, assignmentKey) => {dispatch(watchStudentAssignments(classCode, assignmentKey))}
    }
  }


  const SubmitAssignment = (props) => { 

    const [singleFileOBJ, setsingleFileOBJ] = useState("");
    const [comment, setComment] = useState("");


    async function SingleFilePicker() {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        
        });

        setsingleFileOBJ( res)
   
   
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          Alert.alert('Canceled');
        } else {
          Alert.alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
  }


  async function findClass(uri, fileName, fileKey){

      ////////////////// find correct class
      const classesRef = firebase.database().ref('Classes');
      const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
      query.once('value').then(snapshot => {
          snapshot.forEach(child => {
             createFile(uri, fileName, child.key, fileKey)
          })

      })
  }

  async function createFile(uri, fileName, classKey, fileKey){
    /// upload database
    const rootRef = firebase.database().ref();
    console.log(fileKey);
    const fileRef = rootRef.child("Classes/" + classKey + "/Assignments/" + fileKey + "/StudentAssignments" );


    fileRef.orderByChild('name').equalTo(fileName).once('value')
    .then(snapshot => {
        if(snapshot.exists()){
            Alert.alert('Document already exists'); 
        }
        else{
          Object.values(props.userInfo).forEach(child => {
            var assignmentKey = fileRef.push().getKey()
            fileRef.child(fileKey).set({comment: comment, studentName: child.username, name: fileName, uri: uri, assignmentKey: assignmentKey})
            .then(Alert.alert(
                "Homework successfully uploaded",
                "Added",
                [
                { text: "OK" , onPress: () => {
                    props.watchStudentAssignments(props.classCode, fileKey)
                    props.navigation.navigate('Screens')
                }}
                ],
                { cancelable: false }
            ));
          })
        }
    })

   //// upload storage
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("StudentAssignments/" + fileName);
        return ref.put(blob);

}     


    
        return (
          <View>
              <Card containerStyle={{marginTop:50, marginBottom: 20}}>
                  <Card>
                    <TouchableOpacity activeOpacity={0.5}
                    style={styles.button}
                    onPress={SingleFilePicker}   underlayColor='transparent' >
                    <Icon name="plus" style={styles.icon}></Icon>
                    <Text style={styles.textStyle}>Add File</Text>
                    </TouchableOpacity >
                  </Card>  
                    <View style={styles.buttonStyle}>
                    <Button buttonStyle={{borderRadius:10}} 
                    onPress={() => findClass(singleFileOBJ.uri, singleFileOBJ.name, props.assignmentKey)} title="Submit Homework"/> 
                     <Text style={{fontSize:20, marginHorizontal: 30}}>{"\n"} {singleFileOBJ.name ? singleFileOBJ.name : ''}</Text>
                    </View>
            </Card>
            <Card containerStyle={{marginTop:30}}>
                <Text style={{fontSize:15}}>Share Comment</Text>
                <Input placeholder='Add Comment' 
                value={comment}
                onChangeText={comment => setComment(comment)}
                leftIcon={
                <Icon name='user' style={styles.icon2}/>} rightIcon ={<Icon name="paper-plane" style={styles.icon2}/>}/>
            </Card>
          </View>
        );
    }
    
    
    const styles = StyleSheet.create({
      
        icon: {
          color: "rgba(128,128,128,1)",
          fontSize: 25,
          position: 'absolute',
          marginLeft:100,
          marginTop: 5,
        
        },
        textStyle:{
          marginLeft:130, 
          fontSize:20,
          color: "rgba(128,128,128,1)",
          marginTop: 3,
        },
        buttonStyle:{
          height: 50, 
          width: 300,
          marginTop: 30,
          marginLeft: 25,
          marginBottom:30
        },
        icon2: {
          color: "rgba(128,128,128,1)",
          fontSize: 30
        }
      });

      export default connect(mapStateToProps, mapDispatchToProps)(SubmitAssignment);