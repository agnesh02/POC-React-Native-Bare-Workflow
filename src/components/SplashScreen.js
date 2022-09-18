import React, { useEffect } from "react";
import { app } from "../../api/FirebaseConfig";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { View, StyleSheet, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import Toaster from "./Toaster";

const SplashScreen = ({ navigation }) => {

    const auth = getAuth(app)

    useEffect(async () => {
        try {

            const value = await AsyncStorage.getItem('isRemembered')

            if (value !== null) {

                const asEmail = await AsyncStorage.getItem('as_email')
                const asPassword = await AsyncStorage.getItem('as_password')

                await signInWithEmailAndPassword(auth, asEmail, asPassword)
                    .then(() => {
                        getUserData(asEmail)
                        setTimeout(() => navigation.replace("Side Navigation"), 2000)
                    })
                    .catch((error) => {
                        //const errorCode = error.code;
                        const errorMessage = error.message;
                        Toaster(errorMessage)
                        setVisibility(false)
                    });
            }
            else {
                setTimeout(() => { navigation.replace("Login"); Toaster("Please login") }, 5000)
                console.log(value)
            }
        } catch (e) {
            console.log(e.message)
        }
    }, [])

    const getUserData = async function (email) {

        const firestore = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
        const docRef = doc(firestore, "USERS", email)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            Toaster("Welcome " + docSnap.data().username + ".")
        }
        else {
            Toaster("An error occurred")
        }
    }

    return (
        <View style={styling.mainContainer}>
            <View style={styling.splashScreenRootView}>
                <View style={styling.splashScreenChildView}>
                    <Image source={require('../../assets/POC-RN2.png')}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                </View>
            </View>
        </View>
    );
}

const styling = StyleSheet.create({
    mainContainer:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    splashScreenRootView:
    {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    splashScreenChildView:
    {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
    },
});

export default SplashScreen;