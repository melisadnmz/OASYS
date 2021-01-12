import React, {useState, Children} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert} from 'react-native';
import { Card, Button, Divider } from 'react-native-elements';
import ButtonDate from "react-native-button";
import Entypo from 'react-native-vector-icons/Entypo';
import { AppStyles } from "../../AppStyles";
import DatePicker from 'react-native-date-picker'
import * as firebase from "firebase";
import { connect } from "react-redux";
import {watchAssignments} from '../../redux/app-redux'
import DocumentPicker from 'react-native-document-picker';

const mapStateToProps = (state) => {
    return {
      classCode: state.classCode
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      watchAssignments: (classCode) => {dispatch(watchAssignments(classCode))}
    }
  }

const PostAssignment = (props) => {

    const [date, setDate] = useState(new Date());
    const [singleFileOBJ, setsingleFileOBJ] = useState("");
    const [title, setTitle] = useState("");


    
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

    async function findClass(uri, fileName){

        ////////////////// find correct class
        const classesRef = firebase.database().ref('Classes');
        const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
        query.once('value').then(snapshot => {
            snapshot.forEach(child => {
               createFile(uri, fileName, child.key)
            })

        })
    }

    async function createFile(uri, fileName, classKey){
        /// upload database
        const rootRef = firebase.database().ref();
        const fileRef = rootRef.child("Classes/" + classKey + "/Assignments");


        fileRef.orderByChild('name').equalTo(fileName).once('value')
        .then(snapshot => {
            if(snapshot.exists()){
                Alert.alert('Document already exists'); 
            }
            else{
                var key = fileRef.push().getKey()
                console.log(key);
                fileRef.child(key).set({title: title, deadline: date.toISOString().split('T')[0], name: fileName, uri: uri, key: key })
                .then(Alert.alert(
                    "Homework uploaded",
                    "Homework successfully added",
                    [
                    { text: "OK" , onPress: () => {
                        props.watchAssignments(props.classCode)
                        props.navigation.navigate('Screens')
                    }}
                    ],
                    { cancelable: false }
                ));
            }
        })

       //// upload storage
            const response = await fetch(uri);
            const blob = await response.blob();
    
            var ref = firebase.storage().ref().child("Assignments/" + fileName);
            return ref.put(blob);

    } 


    return(
        <View style={styles.container}>
            <Card containerStyle={styles.card}>
                <Text style={{fontSize:17, marginTop:20, marginBottom:5}}>Title:</Text>
                <View style={styles.InputContainer}>
                    <TextInput
                        style={styles.body}
                        placeholder="Enter Title of Document"
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid="transparent"
                        value={title}
                        onChangeText={title => setTitle(title)}
                    />
                </View>
                <Text style={{fontSize:17, marginTop:20, marginBottom:5}}>Description:</Text>
                <DatePicker
                    date={date}
                    onDateChange={setDate}
                />  
                <Divider style={{ backgroundColor: 'black'}} />  
                <Text style={styles.text}>Please select the file that you want to add</Text>
                <Divider style={{ backgroundColor: 'black'}} />              
                <TouchableOpacity onPress={SingleFilePicker}>
                    <Card containerStyle={styles.cardAdd}>
                        <View style={{flexDirection:'row'}}>
                            <Entypo 
                                style={{marginLeft:10}}
                                name='plus' 
                                size={25} 
                            />
                            <Text style={{fontSize:20, marginHorizontal:20}}>
                                Add Assignment
                             </Text>
                        </View>
                    </Card>
                    <Text style={{fontSize:20, marginHorizontal:20}}>{"\n"}
                     {singleFileOBJ.name ? singleFileOBJ.name : ''}</Text>
                </TouchableOpacity>
                <Button
                    title='Add'
                    containerStyle={{margin:20, }}
                    buttonStyle={{borderRadius:10,}}
                    color='white'
                    onPress={() => findClass(singleFileOBJ.uri, singleFileOBJ.name)}
                />
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    card:{
        borderRadius:10,
        width:'90%',
        alignItems:'center'
    },
    cardAdd:{
        flexDirection:'row',
        borderRadius:40,
        marginTop:20
    },
    text:{
        fontSize:20, 
        textAlign:'center', 
        maxWidth:'80%',
        padding:10
    },
    InputContainer: {
        width: AppStyles.textInputWidth.main,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: AppStyles.color.grey,
        borderRadius: AppStyles.borderRadius.main,
    },
    body: {
        width:300,
        maxWidth:'120%',
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.color.text
    },
    loginContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.tint,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30
      },
      loginText: {
        color: AppStyles.color.white
      },
    
}); 

export default connect(mapStateToProps, mapDispatchToProps)(PostAssignment);