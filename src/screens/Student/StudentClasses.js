import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal} from 'react-native';
import { Card, Button } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from "react-redux";
import {setClassCode, watchAnnouncements} from '../../redux/app-redux'

  const mapStateToProps = (state) => {
    return {
        userClasses: state.userClasses
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      setClassCode: (classCode) => {dispatch(setClassCode(classCode))},
      watchAnnouncements: (classCode) => {dispatch(watchAnnouncements(classCode))}
    }
  }

const StudentClasses = (props) => {

    const [isModalVisible, setModalVisible] = useState(false);

    const [classKey, setClassKey] = useState("");
  
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const deleteClass = () => {
        setModalVisible(!isModalVisible);
    };

    const Class = ({data}) => {
        return(
            <TouchableOpacity
                onPress={
                    () => {
                        props.setClassCode(data.classCode)
                        props.watchAnnouncements(data.classCode)
                        props.navigation.navigate('Class', { name: data.name.toString() })
                    }
                }
            >
                <Card containerStyle={{ borderRadius:10, backgroundColor:data.theme, width:'90%'}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={styles.textName}>{data.name}</Text>
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
                                setClassKey('')
                                toggleModal()
                              }}
                        />
                    </View>
                    <Text style={styles.textField}>{data.courseField}</Text>
                    <Text style={styles.textIns}>{data.instructue}</Text>
                </Card>
            </TouchableOpacity>
            
        );
    }

    return(
        <View style={styles.container}>
            <Button
                    title='Add Class'
                    containerStyle={{margin:20, width:'88%'}}
                    buttonStyle={{borderRadius:10,}}
                    color='white'
                    onPress={
                        () => {props.navigation.navigate('Add Class')}
                    }
            />
            <FlatList 
                data={props.userClasses}
                renderItem={({item}) => <Class data={item} /> }
                keyExtractor={post => post.classCode}
            />    
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
                        title="Delete Class" 
                        onPress={() => {deleteClass}} 
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
};

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    textName:{
        fontSize:25,
        color:'white'
    },
    textField:{
        fontSize:15,
        color:'white'
    },
    textIns:{
        fontSize:15,
        color:'white',
        marginTop:40
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentClasses);