import React, { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import CheckBox from '@react-native-community/checkbox';
import Toaster from "../../components/Toaster";
import { app } from "../../../api/FirebaseConfig";
import { signInWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { initializeFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = function () {

	const auth = getAuth(app)
	const navigation = useNavigation()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [visibility, setVisibility] = useState(false)
	const [isChecked, setIsChecked] = useState(false);

	const userVerification = function (user) {
		sendEmailVerification(user)
			.then(() => {
				console.log(user)
				Toaster("Please check your email, verify yourself and then login.")
			})
			.catch((error) => {
				Toaster(error.message)
			})
		setVisibility(false)
	}

	const loginUser = async function () {


		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {

				const user = userCredential.user;
				if (!user.emailVerified) {
					userVerification(user)
					return
				}

				if (isChecked) {
					AsyncStorage.setItem('isRemembered', "true")
					AsyncStorage.setItem('as_email', email)
					AsyncStorage.setItem('as_password', password)
				}
				setVisibility(false)
				getUserData(email)
				navigation.replace("Side Navigation")
			})
			.catch((error) => {
				//const errorCode = error.code;
				const errorMessage = error.message;
				Toaster(errorMessage)
				setVisibility(false)
			});
	}

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

			<View style={styling.checkboxContainer}>
				<CheckBox value={isChecked} onValueChange={setIsChecked} style={styling.checkbox} />
				<Text style={styling.label}>Remember Me</Text>
			</View>

			<View style={styling.buttonContainer}>
				<TouchableOpacity style={styling.button} onPress={() => validate()}>
					<Text style={styling.buttonText}>Login</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity style={{ position: "absolute", top: 560 }} onPress={() => navigation.navigate("Reset Password")} >
				<Text style={styling.buttonOutlineText}>Forgot you password ?</Text>
			</TouchableOpacity>

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

export default LoginScreen