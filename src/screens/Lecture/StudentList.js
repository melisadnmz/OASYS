import React, {useState} from 'react';
import { View, StyleSheet, FlatList, Text, ScrollView, RefreshControl} from 'react-native';
import { Card, Divider  } from 'react-native-elements'
import { Table, Row, Rows } from 'react-native-table-component';
import Avatar from 'react-native-user-avatar';
import { connect } from "react-redux";
import {watchUserInfo, wathUserClasses, watchStudentList, watchAttendance} from '../../redux/app-redux'

const mapStateToProps = (state) => {
    return {
      classCode: state.classCode,
      studentList: state.studentList,
      totalAttendance: state.totalAttendance
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      watchUserInfo: (email) => {dispatch(watchUserInfo(email))},
      wathUserClasses: (email) => {dispatch(wathUserClasses(email))},
      watchStudentList: (classCode) => {dispatch(watchStudentList(classCode))},
      watchAttendance: (classCode) => {dispatch(watchAttendance(classCode))}
    }
  }



const StudentList = (props) => { 

    const [refreshing, setRefreshing] = useState(false)


    const handleRefresh = () => {
        setRefreshing(true)
        props.watchStudentList(props.classCode)
        props.watchAttendance(props.classCode)
        setRefreshing(false)
    }

        const Student = ({data}) =>{

            const tableHead = ['Total', 'Attended'],
            tableData = [
              [props.totalAttendance, data.attended]      
            ]
    
            return(
                <View>
                    <View style={{ flexDirection: 'row', marginBottom:10 }}>
                        <Avatar 
                            style={{ marginRight: 5 }}
                            size={28}
                            name= {data.name}
                        />
                        
                        <Text style={{ fontSize: 19, }}> {data.name} </Text>
                    </View>               
                    <Table borderStyle={{borderWidth: 1}}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                            <Rows data={tableData} textStyle={styles.text}/>
                    </Table>
                    <Divider style={{ backgroundColor: 'black', marginVertical:10, }} />
                </View>
            );
        }

        const DisplayStudents = () => {
            if(props.studentList.length != 0){
                return(
                    <View>
                    <Card containerStyle={{ margin: 20, borderRadius:10, width:'90%'}}>
                    <FlatList
                        contentContainerStyle={{ paddingBottom: 20}}
                        data={props.studentList}
                        renderItem={({item}) => <Student data={item} /> }
                        keyExtractor={student => student.name}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                />       
                </Card>  
                </View>
                );
            }
            else{
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
                      There is no student!
                    </Text>
                    </Card>
                    </ScrollView>
                  </View>
                );
              }

        }
    
    
       
            return (
                <DisplayStudents />
        );
        
    
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    head:{ 
        height: 50, 
        backgroundColor: '#d3d3d3' 
    },
    text:{ 
        margin: 10
    }
}); 

export default connect(mapStateToProps, mapDispatchToProps)(StudentList);
