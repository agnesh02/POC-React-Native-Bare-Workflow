import React, { useState } from "react";
import { Text, TouchableOpacity, TextInput, StyleSheet, View, ActivityIndicator } from "react-native"
import Toaster from "../../components/Toaster";
import { getAuth, updatePassword } from "firebase/auth";
import { app } from "../../../api/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


const ChangePasswordScreen = function () {

    const auth = getAuth(app)
    const user = auth.currentUser
    const navigation = useNavigation()

    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [visibility, setVisibility] = useState(false)

    const validate = function () {
        setVisibility(true)
        if (newPassword === "" || confirmNewPassword === "") {
            Toaster("Please fill up all the feilds")
            setVisibility(false)
            return
        }
        if(newPassword !== confirmNewPassword)
        {
            Toaster("Passwords does not match")
            setVisibility(false)
            return
        }
        else {
            changePassword()
        }
    }

    const changePassword = async function () {

        updatePassword(user, newPassword).then(() => {
            setVisibility(false)
            console.log("Password has been changed successfully")
            logoutUser()
        }).catch((error) => {
            setVisibility(false)
            if(error.message === "Firebase: Error (auth/requires-recent-login).")
                Toaster("Needs a recent login. Please reauthenticate and try again")
            else
                Toaster(error.message)
            console.log(error.message)
        });
    }

    const logoutUser = async function () {

        auth.signOut()
            .then(async () => {
                await AsyncStorage.removeItem('isRemembered')
                await AsyncStorage.removeItem('as_email')
                await AsyncStorage.removeItem('as_password')
                Toaster("Password has been changed successfully. Please login again")
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  });
            })
            .catch((error) => {
                console.log(error.message)
                Toaster(error.message)
            })
    }


    return (
        <View style={styling.container}>

            <View style={styling.inputContainer}>
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Enter your new password" value={newPassword} onChangeText={text => setNewPassword(text.trim())} style={styling.input} secureTextEntry/>
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="COnfirm your new password" value={confirmNewPassword} onChangeText={text => setConfirmNewPassword(text.trim())} style={styling.input} secureTextEntry/>
            </View>

            <View style={styling.buttonContainer}>
                <TouchableOpacity style={styling.button} onPress={() => validate()}>
                    <Text style={styling.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>

            {visibility ? <ActivityIndicator style={styling.pBar} size="large" /> : null}

        </View>
    )
}


const styling = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: "red"
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '65%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    buttonContainer2: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "flex-end",
        top: 600,
    },
    button: {
        backgroundColor: '#279b27',
        width: '60%',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    button2: {
        backgroundColor: '#0782F9',
        padding: 5,
        borderRadius: 16,
        alignItems: 'center',
        width: "80%"
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 13,
    },
    pBar: {
        borderColor: "black",
        position: "absolute",
        top: 500
    },
    checkboxContainer: {
        marginLeft: -160,
        flexDirection: "row",
        marginTop: 8,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    },
})

export default ChangePasswordScreen
