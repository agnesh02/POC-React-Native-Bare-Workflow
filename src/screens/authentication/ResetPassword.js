import React, { useState } from "react";
import { Text, TouchableOpacity, TextInput, StyleSheet, View, ActivityIndicator } from "react-native"
import Toaster from "../../components/Toaster";
import { app } from "../../../api/FirebaseConfig";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const ResetPasswordScreen = function () {

    const auth = getAuth(app)

    const [email, setEmail] = useState('')
    const [visibility, setVisibility] = useState(false)

    const validate = function () {
        setVisibility(true)
        if (email === "") {
            Toaster("Please enter a valid email id")
            setVisibility(false)
            return
        }
        else {
            sendResetEmail()
        }
    }

    const sendResetEmail = async function () {

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Toaster("Password reset link has been sent to you registered email id")
                setVisibility(false)
            })
            .catch((error) => {
                //const errorCode = error.code;
                Toaster(error.message)
                console.log(error.message)
                setVisibility(false)
            });
    }


    return (
        <View style={styling.container}>

            <View style={styling.inputContainer}>
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Enter your registered email id" value={email} onChangeText={text => setEmail(text.trim())} style={styling.input} />
            </View>

            <View style={styling.buttonContainer}>
                <TouchableOpacity style={styling.button} onPress={() => validate()}>
                    <Text style={styling.buttonText}>Reset Password</Text>
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
        width: '60%',
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
        backgroundColor: '#0a5edb',
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

export default ResetPasswordScreen
