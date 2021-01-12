import React, {useState} from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList, View, Alert, Linking, ScrollView, RefreshControl } from 'react-native';
import { Card, Divider, SearchBar, Button } from 'react-native-elements'
import Entypo from 'react-native-vector-icons/Entypo'
import * as firebase from "firebase";
import { connect } from "react-redux";
import {watchUserInfo, wathUserClasses, watchDocuments} from '../../redux/app-redux'

const mapStateToProps = (state) => {
    return {
      classCode: state.classCode,
      documentList: state.documentList
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      watchUserInfo: (email) => {dispatch(watchUserInfo(email))},
      wathUserClasses: (email) => {dispatch(wathUserClasses(email))},
      watchDocuments: (classCode) => {dispatch(watchDocuments(classCode))}
    }
  }


const LectureDocuments = (props) => { 

    const [refreshing, setRefreshing] = useState(false)

    const dowloandFile = (fileName) =>{
        var ref = firebase.storage().ref().child("Documents/" + fileName);
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

    const handleRefresh = () => {
        setRefreshing(true)
        props.watchDocuments(props.classCode)
        setRefreshing(false)
    }

    Document = ({data}) =>{
        return(
            <Card containerStyle={{ margin: 20, borderRadius:10, width:'90%'}}>
                <Text style={{ fontSize: 20,}}> {data.title} </Text>
                <Divider style={{ backgroundColor: 'black', marginVertical:10 }} />
                <Text style={{ fontSize: 17, marginLeft:10}}> {data.description} </Text>
                <TouchableOpacity onPress={
                        () => {dowloandFile(data.name)}
                    }>
                    <Card 
                        containerStyle={{ borderRadius:40, marginLeft:25}}
                        wrapperStyle={{flexDirection:'row'}}    
                    >
                        <Entypo name='text-document' size={20} />
                        <Text style={{marginLeft:10}}> {data.name} </Text>
                    </Card>  
                </TouchableOpacity>  
            </Card> 
        );
        
    }


    const DisplayDocuments = () => {
        if(props.documentList.length != 0){
          return(
            <View style={{flex:1}}>
               <FlatList
                        contentContainerStyle={{ paddingBottom: 20}}
                        data={props.documentList}
                        renderItem={({item}) => <Document data={item} /> }
                        keyExtractor={document => document.name}
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
                There is no document!
              </Text>
              </Card>
              </ScrollView>
            </View>
          );
        }
    } 

        return (
            <View style={{flex:1}}>
                <Button
                    title='Add Document'
                    containerStyle={{margin:20, width:'88%'}}
                    buttonStyle={{borderRadius:10,}}
                    color='white'
                    onPress={
                        () => {props.navigation.navigate('AddDocument')}
                    }
                 />
                 <DisplayDocuments />
            </View>
    );
    
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    text:{
        fontSize:30,
    }
}); 

export default connect(mapStateToProps, mapDispatchToProps)(LectureDocuments);