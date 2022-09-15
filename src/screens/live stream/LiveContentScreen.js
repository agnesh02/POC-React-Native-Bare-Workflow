import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import Toaster from "../../components/Toaster";

const LiveContentScreen = function ({ route }) {

    const { ip, port, url } = route.params
    let contentUrl = ''

    if (url === '') {
        contentUrl = `http://${ip}:${port}/video`

    }
    else {
        contentUrl = url
    }

    return (
        <WebView source={{ uri: contentUrl }} />
    )
}

const styling = StyleSheet.create({

})

export default LiveContentScreen