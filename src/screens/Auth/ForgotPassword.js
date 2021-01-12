import React, {useState} from "react";
import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import Button from "react-native-button";
import {Avatar} from 'react-native-elements';
import { AppStyles } from "../../AppStyles";
import * as firebase from "firebase";

const ForgotPassword = props => {

  const [email, setEmail] = useState({ value: ""});

  const ForgotPasswordHandler = () => {
    firebase.auth().sendPasswordResetEmail(email.value).then(
        Alert.alert(
          'Email sent',
          "Go to your mail to change password",
          [
          { text: "OK", onPress: () => {props.navigation.navigate('Welcome')} }
          ],
          { cancelable: true }
        )
    )
  }

    return(
        <TouchableWithoutFeedback onPress = {() => {Keyboard.dismiss()}}>
            <View style={styles.container}>
                <Text style={styles.title}>Please enter your e-mail to reset your password!</Text>
                <View style={styles.InputContainer}>
                <TextInput
                    style={styles.body}
                    placeholder="E-mail Address"
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                    value = {email}
                    onChangeText={email => setEmail({ value: email})}
                />
                </View>
                <Button
                  containerStyle={[styles.signupContainer, { marginTop: 30 }]}
                  style={styles.signupText}
                  
                  onPress={ForgotPasswordHandler}
                >
                    Reset
                </Button>
            </View>
        </TouchableWithoutFeedback>
    );  

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent:'center'
    },
    title: {
      fontSize: AppStyles.fontSize.title,
      color: AppStyles.color.tint,
      textAlign: "center",
    },
    placeholder: {
      fontFamily: AppStyles.color.text,
      color: "red"
    },
    InputContainer: {
      width: AppStyles.textInputWidth.main,
      marginTop: 30,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: AppStyles.color.grey,
      borderRadius: AppStyles.borderRadius.main
    },
    body: {
      height: 42,
      paddingLeft: 20,
      paddingRight: 20,
      color: AppStyles.color.text
    },
    signupContainer: {
      width: AppStyles.buttonWidth.main,
      backgroundColor: AppStyles.color.tint,
      borderRadius: AppStyles.borderRadius.main,
      padding: 10,
      marginTop: 30
    },
    signupText: {
      color: AppStyles.color.white
    }
  });
  
  export default ForgotPassword;
