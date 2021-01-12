import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";
import {watchDocuments, watchAnnouncements, watchAssignments, watchUserAttendance, watchAttendance} from '../../redux/app-redux'

import Attendance from './Attendance'
import Announcement from '../Announcement'
import Documents from './Documents';
import Assignment from './Assignment';
import ScanQR from './ScanQR';

const Tab = createBottomTabNavigator();

const mapStateToProps = (state) => {
  return {
    classCode: state.classCode,
    userInfo: state.userInfo,
    email: state.email,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchDocuments: (classCode) => {dispatch(watchDocuments(classCode))},
    watchAnnouncements: (classCode) => {dispatch(watchAnnouncements(classCode))},
    watchAssignments: (classCode) => {dispatch(watchAssignments(classCode))},
    watchUserAttendance: (classCode) => {dispatch(watchUserAttendance(classCode))},
    watchAttendance: (classCode) => {dispatch(watchAttendance(classCode))}
    
  }
}


const StudentTabs = (props) => {

  return (
      <Tab.Navigator 
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Announcement') {
                iconName = focused
                  ? 'ios-information-circle'
                  : 'ios-information-circle-outline';
                  return <Ionicons name={iconName} size={size} color={color} />;
              } 
              else if (route.name === 'Attendance') {
                iconName =  'percent';
                return <MaterialIcon name={iconName} size={size} color={color} />;
              }
              else if (route.name === 'Scan Qr Code') {
                iconName = focused ? 'qrcode' : 'qrcode';
                return <MaterialIcon name={iconName} size={size} color={color} />;
              }
              else if (route.name === 'Lecture Documents') {
                iconName = focused ? 'file-document' : 'file-document-outline';
                return <MaterialIcon name={iconName} size={size} color={color} />;
              }
              else if (route.name === 'Assignment') {
                iconName = focused ? 'ios-list-box' : 'ios-list';
                return <Ionicons name={iconName} size={size} color={color} />;
              }
  
              // You can return any component that you like here!
              
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
      >
        <Tab.Screen 
            name="Announcement" 
            component={Announcement} 
            listeners={{
              tabPress: () => {props.watchAnnouncements(props.classCode)}
            }}
          />
        <Tab.Screen 
            name="Attendance" 
            component={Attendance}
            listeners={{
              tabPress: () => {
                props.watchUserAttendance(props.classCode)
                props.watchAttendance(props.classCode)
              }
            }}
        />
        <Tab.Screen 
            name="Scan Qr Code" 
            component={ScanQR} 
        />
        <Tab.Screen 
            name="Lecture Documents" 
            component={Documents} 
            listeners={{
              tabPress: () => {props.watchDocuments(props.classCode)}
            }}
        />
        <Tab.Screen 
            name="Assignment" 
            component={Assignment} 
            listeners={{
              tabPress: () => {props.watchAssignments(props.classCode)}
            }}
        />
      </Tab.Navigator>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentTabs)