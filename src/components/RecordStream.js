import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import Toaster from "./Toaster";
import { FFmpegKit } from 'ffmpeg-kit-react-native';

const RecordStream = function ({ recordingState, url, path, fileName, onRecordingStarted, onRecordingStopped }) {

    const checkRecordingState = (recordingState) => {
        if (recordingState === "Record") {
            Toaster("Recording the feed..")
            startRecording()
            onRecordingStarted()
        }
        else {
            Toaster(`Recording has been stopped and saved to ${path}`)
            stopRecording()
            onRecordingStopped()
        }
    }

    const startRecording = async function () {

        // RNFS.downloadFile({
        // 	fromUrl: 'http://192.168.1.2:8080/video',
        // 	toFile: `${RNFS.ExternalStorageDirectoryPath}/test.mp4`,
        //   }).promise
        //   .then((r) => {
        // 	console.log(r.statusCode)
        // 	setRecordingState("Stop")
        //   })
        //   .catch((err) => {
        // 	console.log(err.message);
        //   });

        FFmpegKit.execute(`-i ${url} -t 30 -c copy ${path}/${fileName}.mp4`)
            .then(async (session) => {

                const returnCode = await session.getReturnCode();

                if (returnCode.isSuccess(returnCode)) {
                    console.log("success")
                } else if (returnCode.isCancel(returnCode)) {
                    console.log("cancel")
                } else {
                    console.log("error")
                }
            });
    }

    const stopRecording = async function () {
        FFmpegKit.cancel();
    }

    return (
        <View>
            <TouchableOpacity onPress={() => { checkRecordingState(recordingState) }}>
                <Text style={{ color: "red", marginRight: 25, justifyContent: "center", fontSize: 18 }}>{recordingState}</Text>
            </TouchableOpacity>
        </View>
    )

}

const styling = StyleSheet.create({

})

export default RecordStream