import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from "react-native"
import Toaster from "../../components/Toaster";

const LiveStreamScreen = function ({ navigation }) {

    const [ip, setIp] = useState('')
    const [port, setPort] = useState('')
    const [url, setUrl] = useState('')

    const validate = function () {

        if (url === '') {
            if (ip === "" || ip.includes(',') || ip.includes('-')) {
                Toaster("Please enter a valid ip address")
                return
            }
            if (port === "" || port.includes('.') || port.includes(',') || port.includes('-')) {
                Toaster("Please enter a valid port number")
                return
            }
            loadContent()
        }
        else {
            loadContent()
        }
    }

    const loadContent = function () {
        navigation.navigate("Live Content", { ip: ip, port: port, url: url })
    }

    return (
        <View style={styling.container}>
            <View style={styling.inputContainer}>
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Enter IP" value={ip} onChangeText={text => setIp(text.trim())} onPressIn={() => setUrl('')} style={styling.input} keyboardType="numeric" />
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Enter port (default: 8080)" value={port} onChangeText={text => setPort(text.trim())} onPressIn={() => setUrl('')} style={styling.input2} keyboardType="numeric" />
            </View>

            <Text>OR</Text>

            <View style={styling.inputContainer}>
                <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Enter URL" value={url} onChangeText={text => setUrl(text.trim())} onPressIn={() => { setIp(''); setPort('') }} style={styling.input} />
            </View>

            <View style={styling.buttonContainer}>
                <TouchableOpacity style={styling.button} onPress={() => { validate() }}>
                    <Text style={styling.buttonText}>Load</Text>
                </TouchableOpacity>
            </View>
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
    input2: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        width: "60%"
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 90,
    },
    button: {
        backgroundColor: 'blue',
        width: '40%',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
})

export default LiveStreamScreen