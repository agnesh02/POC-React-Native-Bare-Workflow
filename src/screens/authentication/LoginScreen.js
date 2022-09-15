import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import Toaster from "../../components/Toaster";
import { app } from "../../../api/FirebaseConfig";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { initializeFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const LoginScreen = function () {

	const auth = getAuth(app)

	const navigation = useNavigation()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [visibility, setVisibility] = useState(false)

	const getUserData = async function () {

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

	const loginUser = function () {

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in 
				setVisibility(false)
				const user = userCredential.user;
				getUserData()
				navigation.navigate("Side Navigation")
				// navigation.navigate("Side Navigation", { screen: "Dashboard", params: { userEmail: email } })
			})
			.catch((error) => {
				//const errorCode = error.code;
				const errorMessage = error.message;
				Toaster(errorMessage)
				setVisibility(false)
			});
	}

	const validate = function () {
		setVisibility(true)
		if (email === "") {
			Toaster("Please enter a valid email id")
			setVisibility(false)
			return
		}
		if (password === "" || password.length <= 5) {
			Toaster("Please enter a valid password which is more than 5 characters")
			setVisibility(false)
			return
		}
		else {
			loginUser()
		}
	}

	return (
		<View style={styling.container}>
			<View style={styling.inputContainer}>
				<TextInput autoCapitalize="none" autoCorrect={false} placeholder="Email" value={email} onChangeText={text => setEmail(text.trim())} style={styling.input} />
				<TextInput autoCapitalize="none" autoCorrect={false} placeholder="Password" value={password} onChangeText={text => setPassword(text.trim())} style={styling.input} secureTextEntry />
			</View>

			<View style={styling.buttonContainer}>
				<TouchableOpacity style={styling.button} onPress={() => validate()}>
					<Text style={styling.buttonText}>Login</Text>
				</TouchableOpacity>
			</View>
			<View style={styling.buttonContainer2}>
				<TouchableOpacity style={[styling.button2, styling.buttonOutline]} onPress={() => navigation.navigate("Registration")} >
					<Text style={styling.buttonOutlineText}>Don't have an account ? Click here</Text>
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
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
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
	}
})

export default LoginScreen