import React from "react";
import Button from "react-native-button";
import { Text, View, StyleSheet, Image} from "react-native";

import Card from '../../components/Card'
import { AppStyles } from "../../AppStyles";

class WelcomeScreen extends React.Component {

    render(){
        return(
            <View style = {styles.container}>
                <Card>
                    <Text style={styles.title}>Welcome to</Text>
                    <Text style={styles.title}>Online Attendance System</Text>
                    <Image style = {styles.image} source={require('../../images/OASYS.png')} />
                </Card>
                <Button
                    containerStyle={styles.loginContainer}
                    style={styles.loginText}
                    onPress={() => this.props.navigation.navigate('Login')}
                >
                    Log In
                </Button>
                <Button
                    containerStyle={styles.signupContainer}
                    style={styles.signupText}
                    onPress={() => this.props.navigation.navigate('Signup')}
                >
                    Sign Up
                </Button>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 150
    },
    title: {
      fontSize: AppStyles.fontSize.title,
      fontWeight: "bold",
      textAlign: "center",
    },
    loginContainer: {
      width: AppStyles.buttonWidth.main,
      backgroundColor: AppStyles.color.tint,
      borderRadius: AppStyles.borderRadius.main,
      padding: 10,
      marginTop: 30
    },
    loginText: {
      color: AppStyles.color.white
    },
    signupContainer: {
      width: AppStyles.buttonWidth.main,
      backgroundColor: AppStyles.color.white,
      borderRadius: AppStyles.borderRadius.main,
      padding: 8,
      borderWidth: 1,
      borderColor: AppStyles.color.tint,
      marginTop: 15
    },
    signupText: {
      color: AppStyles.color.tint
    },
    image: {
      width: 120,
      height: 60,
      margin:10
    }
  });
  
  export default WelcomeScreen;