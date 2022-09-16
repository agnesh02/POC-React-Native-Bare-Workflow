import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, PermissionsAndroid } from "react-native";
import { WebView } from "react-native-webview";
import Toaster from "../../components/Toaster";
import RecordStream from "../../components/RecordStream";
import RNFS from "react-native-fs"
import { useNavigation } from "@react-navigation/native";

const LiveContentScreen = function ({ route }) {

    const [recordingState, setRecordingState] = useState("Record")
    const { ip, port, url } = route.params
    let contentUrl = ''

    if (url === '') {
        contentUrl = `http://${ip}:${port}/video`
    }
    else {
        contentUrl = url
    }

    const requestStoragePermission = async function () {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Permission for recording locally',
                message: 'Requirement for storing the recordings',
                buttonNeutral: 'Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission Granted. Try recording again");

        } else {
            console.log("Permission denied");
        }
    }

    requestStoragePermission()

    const dirName = 'poc-rn-recordings'
    const absolutePath = RNFS.ExternalStorageDirectoryPath + '/' + dirName
    RNFS.exists(absolutePath)
        .then((exists) => {
            if (exists) {
                console.log("PATH EXISTS");
            } else {
                console.log("PATH DOES NOT EXIST..Creating directory..");
                RNFS.mkdir(absolutePath)
                    .then(() =>
                        console.log("Directory created successfully")
                    )
                    .catch((error) => {
                        console.log(error.message)
                        console.log("Check for storage permission")
                        Toaster(error.message+" : "+"Also, please check if the storage permissions are granted")
                    })
            }
        });

    useNavigation().setOptions(
        {
            headerRight: () => (
                <RecordStream 
                    recordingState={recordingState} 
                    url={contentUrl} path={absolutePath.replace('/','')} 
                    fileName = {Date().replace(/ /g,'')}
                    onRecordingStarted={() => setRecordingState("Stop")} 
                    onRecordingStopped={() => setRecordingState("Record")} 
                />
            )
        }
    )

    return (
        <WebView source={{ uri: contentUrl }} />
    )
}


const styling = StyleSheet.create({

})

export default LiveContentScreen