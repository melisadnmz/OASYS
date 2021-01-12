import React, {useState} from "react";
import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform } from "react-native";
import Button from "react-native-button";
import {Avatar} from 'react-native-elements';
import { AppStyles } from "../../AppStyles";
import * as firebase from "firebase";



const SignupScreen = props => {

    const [email, setEmail] = useState({ value: ""});
    const [password, setPassword] = useState({ value: ""});

    const [username, setusername] = useState({ value: ""})
    const [userType, setUserType] = useState('') 

    const rootRef = firebase.database().ref();
    const userRef = rootRef.child("User/");

    const handleSignUp = () => {
        
        try{

            if(password.value.length < 8){
                alert('Please enter 8 characters')
                return;
            }

            if(userType == ''){
                alert('Please select user type')
                return;
            }


            firebase
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value)
            .then(() => {
                userRef.push(
                    {
                        username: username.value, 
                        userType: userType, 
                        email: email.value, 
                    }
                    ).then(
                        Alert.alert(
                            "Welcome to family",
                            "You have successfully signed up",
                            [
                            { text: "OK", onPress: () => {
                                props.navigation.navigate('Login')
                                setUserType('');
                                setusername({value:''});
                                setEmail({value:''});
                                setPassword({value:''});
                                setSizeStudent('medium');
                                setSizeProfessor('medium');
                            }}
                            ],
                            { cancelable: false }
                        )
                )
            }).catch(error => {
                switch (error.code) {
                   case 'auth/email-already-in-use':
                     alert(`Email address ${email.value} already in use.`)
                     break;
                   case 'auth/invalid-email':
                     alert(`Email address ${email.value} is invalid.`);
                     break;
                   case 'auth/operation-not-allowed':
                     alert(`Error during sign up.`);
                     break;
                   case 'auth/weak-password':
                     alert('Password is not strong enough. Add additional characters including special characters and numbers.');
                     break;
                   default:
                     console.log(error.message);
                 }
             })

        }
        catch(error){
            console.log(error.toString())    
        }

    }

    const [sizeStudent, setSizeStudent] = useState('medium');
    const [sizeProfessor, setSizeProfessor] = useState('medium');

    const studentAvatarHandler = () => {
        if(sizeStudent == 'medium'){
            setSizeProfessor('medium');
            setSizeStudent('large');
            setUserType('Student')
        }
        else{
            setSizeStudent('medium');
        }
        
    }

    const professorAvatarHandler = () => {
        if(sizeProfessor == 'medium'){
            setSizeProfessor('large');
            setSizeStudent('medium');
            setUserType('Lecturer')
        }
        else{
            setSizeProfessor('medium');
        }
        
    }
    
    return(
        <TouchableWithoutFeedback onPress = {() => {Keyboard.dismiss()}}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
                <Text style={styles.title}>Create new account</Text>
                <View style = {styles.avatarContainer}>
                    <View style = {{alignItems : 'center'}}>
                        <Avatar
                            id = 'student'
                            rounded
                            source={require('../../images/student.png')} 
                            size = {sizeStudent}
                            containerStyle = {{marginHorizontal: 30}}
                            onPress = {studentAvatarHandler}
                        />
                        <Text>Student</Text>
                    </View>
                    <View style = {{alignItems : 'center'}}>
                        <Avatar
                            id = 'professor'
                            rounded
                            source={require('../../images/professor1.png')} 
                            size = {sizeProfessor}
                            containerStyle = {{marginHorizontal: 30}}
                            onPress = {professorAvatarHandler}
                        />
                        <Text>Lecturer</Text>
                    </View>
                </View>
                <View style={styles.InputContainer}>
                    <TextInput
                        style={styles.body}
                        placeholder="Full Name"
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid="transparent"
                        value={username.value}
                        onChangeText={username => setusername({ value: username})}
                    />
                </View>
                <View style={styles.InputContainer}>
                <TextInput
                    style={styles.body}
                    placeholder="E-mail Address"
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    value={email.value}
                    onChangeText={email => setEmail({ value: email})}
                    
                />
                </View>
                <View style={styles.InputContainer}>
                <TextInput
                    style={styles.body}
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    value={password.value}
                    onChangeText={password => setPassword({ value: password})}
                />
                </View>
                <Button
                containerStyle={[styles.signupContainer, { marginTop: 50 }]}
                style={styles.signupText} onPress={handleSignUp}
                >
                Sign Up
                </Button>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );                
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center"
    },
    avatarContainer:{
        flexDirection: "row",
        justifyContent: 'space-around',
    },
    title: {
      fontSize: AppStyles.fontSize.title,
      fontWeight: "bold",
      color: AppStyles.color.tint,
      marginTop: 20,
      marginBottom: 20,
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
  
  export default SignupScreen;