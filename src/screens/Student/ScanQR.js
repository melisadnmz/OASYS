
import * as firebase from "firebase";
import { connect } from "react-redux";
import React, { useState } from 'react';
//import react in our code.
import { Text, View, TouchableHighlight, PermissionsAndroid, Platform, StyleSheet, Alert} from 'react-native';
// import all basic components
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
//import CameraKitCameraScreen we are going to use.

const mapStateToProps = (state) => {
  return {
    classCode: state.classCode,
    userInfo: state.userInfo,
    email: state.email
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

 const ScanQR = (props) => {

  const [qrvalue, setQrValue] = useState('')
  const [opneScanner, setOpneScanner] = useState('')

  const [codeExists, setCodeExists] = useState(false); 


  const onBarcodeScan = (qrvalue) => {
    //called after te successful scanning of QRCode/Barcode
    setQrValue( qrvalue);
    setOpneScanner(false);

    
    const classesRef = firebase.database().ref('Classes');
    const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
     query.once('value').then(snapshot => {
            snapshot.forEach(child => {
                firebase.database().ref()
                .child("Classes/" + child.key + "/Attendance")
                .once('value', (snapshot) => {
                  snapshot.forEach(child => {
                    if(child.val().qrCode == qrvalue){
                      const userRef = firebase.database().ref("User");
    
                      const query = userRef.orderByChild('email').equalTo(props.email)
                      query.once('value').then(user => {
                          user.forEach(child => {
                            child.child('classes').forEach(snapshotchild => {
                              if(props.classCode == snapshotchild.child("classCode").val() && child.child("userType").val() == 'Student'){
                                setCodeExists(true)
                                const attendance = snapshotchild.val().attendance
                                firebase.database().ref().child("User/" + child.key + '/classes/' + snapshotchild.key).update({
                                  attendance: attendance + 1,
                              })
                              
                              }
                            })
                          })
                        }).then(
                            Alert.alert(
                              "Attendance Taken",
                              "You have successfully attended the class",
                              [
                              { text: "OK", onPress: () => {
                                setCodeExists(true)
                              }}
                              ],
                              { cancelable: false }
                            )
                          )
                         
                    }
                  })
            }).then(() => {
              if(codeExists == false){
                  alert('QR Code is invalid')
              }
          })
        })
      })

  }
  const onOpneScanner = () => {
    //To Start Scanning
    if(Platform.OS === 'android'){
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,{
              'title': 'CameraExample App Camera Permission',
              'message': 'CameraExample App needs access to your camera '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
              setQrValue( '');
              setOpneScanner(true);
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err",err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    }else{
      setQrValue( '');
      setOpneScanner(true);
    }    
  }
    let displayModal;
    //If qrvalue is set then return this view
    if (!opneScanner) {
      return (
        <View style={styles.container}>
            <Text style={styles.heading}>React Native QR Code Example</Text>
            <Text style={styles.simpleText}>{qrvalue ? 'Scanned QR Code: '+ qrvalue : ''}</Text>
            <TouchableHighlight
              onPress={ onOpneScanner}
              style={styles.button}>
                <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                Open QR Scanner
                </Text>
            </TouchableHighlight>
        </View>
      );
    }
    else{
    return (
      <View style={{ flex: 1 }}>
        <CameraKitCameraScreen
          showFrame={false}
          //Show/hide scan frame
          scanBarcode={true}
          //Can restrict for the QR Code only
          laserColor={'blue'}
          //Color can be of your choice
          frameColor={'yellow'}
          //If frame is visible then frame color
          colorForScannerFrame={'black'}
          //Scanner Frame color
          onReadCode={event =>
            onBarcodeScan(event.nativeEvent.codeStringValue)
          }
        />
      </View>
    );
        }
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ff5a66',
    padding: 10,
    width:300,
    marginTop:16
  },
  heading: { 
    color: 'black', 
    fontSize: 24, 
    alignSelf: 'center', 
    padding: 10, 
    marginTop: 30 
  },
  simpleText: { 
    color: 'black', 
    fontSize: 20, 
    alignSelf: 'center', 
    padding: 10, 
    marginTop: 16
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanQR)