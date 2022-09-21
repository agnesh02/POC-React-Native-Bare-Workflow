import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import Toaster from "../../components/Toaster";
import { launchImageLibrary } from 'react-native-image-picker';
import { app } from '../../../api/FirebaseConfig'
import { doc, initializeFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigation } from '@react-navigation/native';



const ProfilePictureScreen = function ({ route }) {

    const { userEmail } = route.params
    const navigation = useNavigation()

    const [image, setImage] = useState(null);
    const [uploadingStatus, setUploadingStatus] = useState(false);

    const pickImage = async () => {

        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                //const source = { uri: response.uri };
                console.log('response', JSON.stringify(response));
                setImage(response.assets[0].uri)
            }
        });

    };

    const uploadImage = async function () {

        setUploadingStatus(true)
        Toaster("Uploading file...This may take time depending on your connectivity")
        const firebaseStorage = getStorage(app)
        const firestore = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
        // const auth = getAuth(app)
        // const userEmail = auth.currentUser?.email

        try {
            const response = await fetch(image)
            const blob = await response.blob();

            var storageRef = ref(firebaseStorage, `USERS/${userEmail}`)
            await uploadBytes(storageRef, blob)
                .then((snapshot) => {
                    getDownloadURL(storageRef)
                        .then((url) => {
                            const docRef = doc(firestore, "USERS", userEmail)
                            updateDoc(docRef, { image_uri: url })
                        })
                        .catch((error) => {
                            //Toaster(error.message)
                        });
                })
                .catch((error) => {
                    //const errorCode = error.code;
                    const errorMessage = error.message;
                    Toaster(errorMessage)
                    setUploadingStatus(false)
                })

            Toaster("Profile picture has been updated successfully")
            navigation.replace("Side Navigation")
            setUploadingStatus(false)
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {image && <Image source={{ uri: image }} style={{ width: 300, height: 200 }} />}
            <View style={styling.buttonContainer}>
                <TouchableOpacity style={styling.button} onPress={() => pickImage()}>
                    <Text style={styling.buttonText}>Choose an image</Text>
                </TouchableOpacity>

                {image ?
                    <TouchableOpacity style={styling.button} onPress={() => uploadImage()}>
                        <Text style={styling.buttonText}>Upload image</Text>
                    </TouchableOpacity>
                    : null}

            </View>
            {uploadingStatus ? <ActivityIndicator style={styling.pBar} size="large" /> : null}
        </View>
    );
}

const styling = StyleSheet.create({
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
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    pBar: {
        borderColor: "black",
        position: "absolute",
        top: 550
    }
})

export default ProfilePictureScreen

