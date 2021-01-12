import React,{useState} from "react";
import { Text, View, StyleSheet,TouchableOpacity, Alert, FlatList, ScrollView, RefreshControl } from "react-native";
import  {Card, Button, Divider} from 'react-native-elements';
import Icon from "react-native-vector-icons/Entypo";
import { connect } from "react-redux";
import {watchUserInfo, wathUserClasses, watchAssignments, watchStudentAssignments, setAssignmentKey, watchStudentList} from '../../redux/app-redux'

const mapStateToProps = (state) => {
  return {
    classCode: state.classCode,
    assignmentList: state.assignmentList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchUserInfo: (email) => {dispatch(watchUserInfo(email))},
    wathUserClasses: (email) => {dispatch(wathUserClasses(email))},
    watchAssignments: (classCode) => {dispatch(watchAssignments(classCode))},
    setAssignmentKey: (assignmentKey) => {dispatch(setAssignmentKey(assignmentKey))},
    watchStudentAssignments: (classCode, assignmentKey) => {dispatch(watchStudentAssignments(classCode, assignmentKey))},
    watchStudentList: (classCode) => {dispatch(watchStudentList(classCode))},
  }
}


  const LectureAssignment = (props) => {

    const [refreshing, setRefreshing] = useState(false)

    const Post = ({data}) => {
      return(
           <TouchableOpacity   
           onPress={
            () => {
                props.navigation.navigate('Assignments')
                props.setAssignmentKey(data.key)
                props.watchStudentAssignments(props.classCode, data.key)
                props.watchStudentList(props.classCode)
            }
        }
            >
            <Card containerStyle={{margin:20}}>
                 <Icon name="text-document" style={styles.icon2}></Icon>
                  <Text style={{marginLeft:50}}>
                     {data.title} 
                  </Text>
                  <Text style={{marginLeft:50}}>{"Deadline " + data.deadline}</Text>
                  <Icon name="export" style={styles.icon4}></Icon>
            </Card>
            </TouchableOpacity>

        );
    }

    const handleRefresh = () => {
      setRefreshing(true)
      props.watchAssignments(props.classCode)
      setRefreshing(false)
  }

  const DisplayAssignments = () => {
    if(props.assignmentList.length != 0){
      return(
        <View style={{flex:1}}>
             <FlatList 
                  contentContainerStyle={{ paddingBottom: 20}}
                  data={props.assignmentList}
                  renderItem={({item}) => <Post data={item} /> }
                  keyExtractor={post => post.name}
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
            There is no assignment!
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
                    title='Add Assignment'
                    containerStyle={{margin:20, width:'88%'}}
                    buttonStyle={{borderRadius:10,}}
                    color='white'
                    onPress={
                        () => {
                          props.navigation.navigate('PostAssignment')
                        }}
                 />
                 <DisplayAssignments />
      </View>
      
    );
  }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
        },
        icon4: {
            color: "rgba(128,128,128,1)",
            fontSize: 25,
            position: 'absolute',
            marginLeft: 290,
            marginTop: 5
          },
        icon2: {
            color: "rgba(128,128,128,1)",
            fontSize: 40,
            position: 'absolute'
          },
       });
  

       export default connect(mapStateToProps, mapDispatchToProps)(LectureAssignment);