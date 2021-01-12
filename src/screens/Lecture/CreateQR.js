//This is an example code to generate QR code//
import React, {useState} from 'react';
//import react in our code.
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
// import all basic components
import QRCode from 'react-native-qrcode-svg';
import { Card, Button } from 'react-native-elements';
import * as firebase from "firebase";
import { connect } from "react-redux";
import {setAttendanceKey} from '../../redux/app-redux'

const mapStateToProps = (state) => {
  return {
    classCode: state.classCode,
    attendanceKey: state.attendanceKey
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAttendanceKey:  (Key) => {dispatch(setAttendanceKey(Key))},
  }
}

const CreateQR = (props) => {

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  
  const [valueForQRCode, setValueForQRCode] = useState('')


  const getTextInputValue = () => {
    setModalVisible(!isModalVisible);
    let qrCode = Math.random().toString(36).substring(8)
    setValueForQRCode(qrCode);

    const classesRef = firebase.database().ref('Classes');
    const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
    query.once('value').then(snapshot => {
        snapshot.forEach(child => {
            const ref = firebase.database().ref()
            .child("Classes/" + child.key + "/Attendance")

            var key = ref.push().getKey()
            ref.child(key).set(
              {
                qrCode: qrCode,
                key: key,
              }
            )
            props.setAttendanceKey(key)
        })
    })
  };

  const onCancel = (key) => {

    const classesRef = firebase.database().ref('Classes');
      const query = classesRef.orderByChild('classCode').equalTo(props.classCode);
      query.once('value').then(snapshot => {
          snapshot.forEach(child => {
              firebase.database().ref()
              .child("Classes/" + child.key + "/Attendance/" + key)
              .once('value', (snapshot) => {
                snapshot.ref.remove()
          })
        })
      }).then(
        () => {
          setModalVisible(!isModalVisible);
        }
      )

  }
  
    return (
      <View style={styles.MainContainer}>
        <Card containerStyle={{marginBottom:20}}>
            <Text style={styles.title}>In order to take attendance please generate a QR code!</Text>
        </Card>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <QRCode
                //QR code value
                value={valueForQRCode ? valueForQRCode : 'NA'}
                //size of QR Code
                size={250}
                //Color of the QR Code (Optional)
                color="black"
                //Background Color of the QR Code (Optional)
                backgroundColor="white"
                //Logo of in the center of QR Code (Optional)
              />
              <Text style={{margin:10}}>QR Code: {valueForQRCode}</Text>
              <Button 
                  containerStyle={{marginBottom:15}} 
                  buttonStyle={{width:200}}
                  title="Attandance Taken" 
                  onPress={toggleModal} 
              />
              <Button 
                  buttonStyle={{backgroundColor: "red", width:200}} 
                  title='Cancel' 
                  onPress={() => {onCancel(props.attendanceKey)}} 
              />
            </View>
          </View>
        </Modal> 
        <TouchableOpacity
          onPress={getTextInputValue}
          activeOpacity={0.7}
          style={styles.button}>
          <Text style={styles.TextStyle}> Generate QR Code </Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    paddingTop: 40,
  },
  TextInputStyle: {
    width: '100%',
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    textAlign: 'center',
  },
  button: {
    width: '90%',
    paddingTop: 8,
    marginHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#F44336',
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: '#F44336',
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
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
  centeredView: {
      flex: 1,
      justifyContent: "center",
      marginTop: 22
    },
});


export default connect(mapStateToProps, mapDispatchToProps)(CreateQR);