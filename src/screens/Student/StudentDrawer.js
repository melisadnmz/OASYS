import React from 'react';
import {Image, View, Text, Alert, FlatList} from 'react-native';
import Button from 'react-native-button/Button';
import { 
    DrawerItem,
    createDrawerNavigator, 
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import AntDesingn from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated from 'react-native-reanimated';
import { connect } from "react-redux";
import {setClassCode, watchAnnouncements, watchDocuments, watchAssignments, watchUserAttendance, watchAttendance} from '../../redux/app-redux'

import StudentClasses from './StudentClasses'
import StudentTabs from './StudentTabs'
import AddClass from './AddClass'
import PostQuestion from './PostQuestion';
import CommentScreen from '../CommentScreen';
import SubmitAssignment from './SubmitAssignment';

const mapStateToProps = (state) => {
    return {
        userClasses: state.userClasses
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      setClassCode: (classCode) => {dispatch(setClassCode(classCode))},
      watchAnnouncements: (classCode) => {dispatch(watchAnnouncements(classCode))},
      watchDocuments: (classCode) => {dispatch(watchDocuments(classCode))},
    watchAssignments: (classCode) => {dispatch(watchAssignments(classCode))},
    watchUserAttendance: (classCode) => {dispatch(watchUserAttendance(classCode))},
    watchAttendance: (classCode) => {dispatch(watchAttendance(classCode))}
    }
  }

const Drawer =  createDrawerNavigator();
const Stack = createStackNavigator();

const Screens = () => {
    return(
        <Stack.Navigator >
            <Stack.Screen name="Screens" component={DrawerScreens} options={{ headerShown: false }}/>
            <Stack.Screen name="Add Class" component={AddClass} />
            <Stack.Screen name='Post' component={PostQuestion} />
            <Stack.Screen name='Comments' component={CommentScreen} />
            <Stack.Screen name='Submit' component={SubmitAssignment} />
        </Stack.Navigator>
    );
}

const  DrawerScreens = ({navigation, style}) => {
    return(
        <Animated.View style={[{flex: 1, overflow: 'hidden'}, style]}>
            <Stack.Navigator
                screenOptions={{
                    headerLeft: () => (
                        <Button 
                            containerStyle ={{padding:10, marginHorizontal: 10}}
                            onPress={() => {navigation.openDrawer()}}
                        >
                            <Feather name='menu' size={18} />
                        </Button>
                    )
                }}
            >
                <Stack.Screen name="Student Classes" component={StudentClasses} />
                <Stack.Screen name="Class" options={({ route }) => ({ title: route.params.name })}>
                    {props  => <StudentTabs {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </Animated.View>
    );
}

const DrawerContent = ({props}) => {

    const ClassDrawerItem = ({data}) => {
        return(
            <DrawerItem
                label = {data.name.toString()}
                labelStyle={{marginLeft: -16}}
                onPress={
                    () => {
                        props.setClassCode(data.classCode)
                        props.watchAnnouncements(data.classCode)
                        props.watchAnnouncements(data.classCode)
                        props.watchAssignments(data.classCode)
                        props.watchUserAttendance(data.classCode)
                        props.watchAttendance(data.classCode)
                        props.watchDocuments(data.classCode)
                        props.navigation.navigate('Class', { name: data.name.toString() })
                    }
                }
                icon={() => <FontAwesome name='book' size={16} />}
            />
        );
    }

    const LogoutAlert = () => {
        Alert.alert(
            "Loging out!",
            "Are you sure you want to log out?",
            [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "Yes", onPress: () => props.navigation.navigate('Welcome') }
            ],
            { cancelable: false }
        );
    }

    return(
            <View  style={{flex: 1}}>
                <View
                    style={{flex:0.4, justifyContent: "flex-end", margin:20}}
                >
                    <Image 
                        source={
                            require('../../images/OASYS.png')
                        }
                        resizeMode = 'center'
                        style = {{height: 50, width: 100}}         
                    />
                    <Text style={{marginTop:10}}>Online Attendance System</Text>
                </View>
                <View style={{flex: 1}}>
                    <DrawerItem
                        label="Student Classes"
                        labelStyle={{marginLeft: -16}}
                        onPress={() => props.navigation.navigate('Student Classes')}
                        icon={() => <AntDesingn name='dashboard' size={16} />}
                    />
                    <FlatList 
                            data={props.userClasses}
                            renderItem={({item}) => <ClassDrawerItem data={item} /> }
                            keyExtractor={classes => classes.id}
                    /> 
                </View>
                <View style={{marginBottom:20}}>
                <DrawerItem
                        label="Logout"
                        labelStyle={{marginLeft: -16}}
                        onPress={LogoutAlert}
                        icon={() => <AntDesingn name='logout' size={16} />}
                    />
                </View>
                
            </View>
    );
};

const StudentDrawer = (data) => {
    const [progress, setProgress] = React.useState(new Animated.Value(0));

    const scale = Animated.interpolate(progress, {
        inputRange: [0,1],
        outputRange: [1, 0.8]
    });

    const borderRadius = Animated.interpolate(progress, {
        inputRange: [0,1],
        outputRange: [0, 20]
    })

    const screenStyles = { borderRadius, transform: [{ scale }] };

    return(
        <Drawer.Navigator 
            drawerType='slide'
            overlayColor= 'transparent'
            initialRouteName="Classes"
            drawerStyle={{width: '50%'}}
            drawerContentOptions={{
                activeBackgroundColor: 'transparent'
            }}
            sceneContainerStyle ={{backgroundColor: 'white'}}
            drawerContent={props => {
                setProgress(props.progress);
                return <DrawerContent  {...props} props={data} />;
            }}
        >
            <Drawer.Screen name="Screens">
                {props => <Screens {...props} style={screenStyles} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentDrawer)

