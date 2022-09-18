import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { app } from '../../api/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Toaster from './Toaster';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const CustomDrawer = props => {

    const auth = getAuth(app)
    const userEmail = auth.currentUser?.email
    const [username, setUsername] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const getProfileData = async function () {

        const firestore = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
        const docRef = doc(firestore, "USERS", userEmail)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data()
            setUsername(data.username)
            setImageUrl(data.image_uri)
        }
        else {
            //Toaster("Some error occurred")
        }
    }

    useEffect(() => { getProfileData() }, [])

    const logoutUser = async function () {

        auth.signOut()
            .then(async () => {
                await AsyncStorage.removeItem('isRemembered')
                await AsyncStorage.removeItem('as_email')
                await AsyncStorage.removeItem('as_password')
                Toaster("User logged out successfully")
                props.navigation.replace("Login")
            })
            .catch((error) => {
                console.log(error.message)
                Toaster(error.message)
            })
    }

    return (
        <View style={{ marginTop: -40, flex: 1 }}>

            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#8200d6' }}>

                <ImageBackground source={require('../../assets/headerBG.jpg')} style={styling.ImageBackgroundStyle}>

                    {imageUrl && <Image source={{ uri: imageUrl }} style={styling.imageAvatarStyle} />}
                    {imageUrl === "" && <Image source={require("../../assets/user.png")} style={styling.imageAvatarStyle} />}
                    <Text style={styling.navHeaderTextStyle}> {username} </Text>
                    <Text style={styling.navHeaderTextStyle2}> {userEmail} </Text>

                </ImageBackground>

                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={() => { logoutUser() }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IonIcon name="exit-outline" size={24} color="red" />
                        <Text style={{ fontSize: 15, marginLeft: 5 }}> Loguut </Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styling = StyleSheet.create({
    ImageBackgroundStyle: {
        paddingTop: 50,
        alignItems: "center"
    },
    imageAvatarStyle: {
        height: 80,
        width: 80,
        borderRadius: 40,
        marginBottom: 10
    },
    navHeaderTextStyle: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 5
    },
    navHeaderTextStyle2: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10
    }
})

export default CustomDrawer;