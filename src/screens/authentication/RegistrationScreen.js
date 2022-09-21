import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import Toaster from "../../components/Toaster";
import { app } from "../../../api/FirebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { initializeFirestore, setDoc, doc } from "firebase/firestore";

const RegistrationScreen = function () {

    const auth = getAuth(app)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [visibility, setVisibility] = useState(false)

    const appendUserData = async function () {
        const firestore = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
        try {
            const data = {
                username: username,
                dob: "",
                fullname: "",
                image_uri: "",
                phone: ""
            }
            await setDoc(doc(firestore, "USERS", email), data);
            setVisibility(false)
            Toaster("User registered successfully")
        } catch (e) {
            console.error("Error adding document: ", e);
            setVisibility(false)
            Toaster(e.message)
        }
    }

    const registerUser = function () {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //const user = userCredential.user;
                appendUserData()
            })
            .catch((error) => {
                //const errorCode = error.code;
                const errorMessage = error.message;
                Toaster(errorMessage)
            });
    }

    const validate = function () {
        setVisibility(true)
        if (username === "" || username.length <= 2) {
            Toaster("Please enter a valid username with more than 2 characters")
            setVisibility(false)
            return
        }
        if (email === "") {
            Toaster("Please enter a valid email id")
            setVisibility(false)
            return
        }
        if (password === "" || password.length <= 5) {
            Toaster("Please enter a valid password with more than 5 characters")
            setVisibility(false)
            return
        }
        if (confirmPassword === "" || confirmPassword != password) {
            Toaster("Passwords does not match")
            setVisibility(false)
            return
        }
        else {
            registerUser()
        }
    }


    return (
        <View style={styling.container}>
            <View style={styling.inputContainer}>
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Username" value={username} onChangeText={text => setUsername(text)} style={styling.input} />
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Email" value={email} onChangeText={text => setEmail(text.trim())} style={styling.input} />
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Password" value={password} onChangeText={text => setPassword(text.trim())} style={styling.input} secureTextEntry />
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Confirm Password" value={confirmPassword} onChangeText={text => setconfirmPassword(text.trim())} style={styling.input} secureTextEntry />
            </View>

            <View style={styling.buttonContainer}>
                <TouchableOpacity style={styling.button}
                    onPress={() => {
                        validate()
                    }
                    }>
                    <Text style={styling.buttonText}>Register Now</Text>
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
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
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
        fontSize: 16,
    },
    pBar: {
        borderColor: "black",
        position: "absolute",
        top: 550
    }
})

export default RegistrationScreen