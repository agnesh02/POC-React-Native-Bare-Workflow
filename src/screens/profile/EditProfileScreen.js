import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import Toaster from "../../components/Toaster";
import { doc, updateDoc } from "firebase/firestore";
import { initializeFirestore } from "firebase/firestore";
import { app } from "../../../api/FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const EditProfileScreen = function ({ route }) {

	const { userEmail, usernameParam, fullnameParam, dobParam, contactParam, imageUrlParam } = route.params
	const navigation = useNavigation()

	const [username, setUsername] = useState(usernameParam)
	const [fullname, setFullname] = useState(fullnameParam)
	const [dob, setDob] = useState(dobParam)
	const [contact, setContact] = useState(contactParam)

	const [visibility, setVisibility] = useState(false)

	const updateUserData = async function () {

		const firestore = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
		const docRef = doc(firestore, "USERS", userEmail)

		let image_uri = imageUrlParam

		if(image_uri===null)
			image_uri = ""

		const data = {
			username: username,
			fullname: fullname,
			dob: dob,
			image_uri: image_uri,
			phone: contact
		}

		try {
			await updateDoc(docRef, data)
			setVisibility(false)
			Toaster("Profile updated successfully")
			navigation.replace("Side Navigation")
		}
		catch (e) {
			console.error("Error adding document: ", e);
			setVisibility(false)
			Toaster(e.message)
		}

	}

	const validate = function () {
		setVisibility(true)
		if (username === "") {
			Toaster("Please enter a valid username")
			setVisibility(false)
			return
		}
		if (fullname === "") {
			Toaster("Please enter a valid fullname")
			setVisibility(false)
			return
		}
		if (dob === "") {
			Toaster("Please enter a valid dob")
			setVisibility(false)
			return
		}
		if (contact === "" || contact.length < 10) {
			Toaster("Please enter a valid contact")
			setVisibility(false)
			return
		}
		else {
			updateUserData()
		}
	}

	return (
		<View style={styling.container}>
			<View style={styling.inputContainer}>
				<TextInput autoCapitalize="none" autoCorrect={false} placeholder="Username" value={username} onChangeText={text => setUsername(text)} style={styling.input} />
				<TextInput autoCapitalize="none" autoCorrect={false} placeholder="Fullname" value={fullname} onChangeText={text => setFullname(text)} style={styling.input} />
				<TextInput autoCapitalize="none" autoCorrect={false} placeholder="DOB" value={dob} onChangeText={text => setDob(text)} style={styling.input} />
				<TextInput autoCapitalize="none" autoCorrect={false} placeholder="Contact" value={contact} onChangeText={text => setContact(text)} style={styling.input} />
			</View>

			<View style={styling.buttonContainer}>
				<TouchableOpacity style={styling.button} onPress={() => validate()}>
					<Text style={styling.buttonText}>Update profile</Text>
				</TouchableOpacity>
			</View>

			{/* <View style={styling.buttonContainer2}>
                <TouchableOpacity style={[styling.button2, styling.buttonOutline]} onPress={() => navigation.navigate("Registration")} >
                    <Text style={styling.buttonOutlineText}>Don't have an account ? Click here</Text>
                </TouchableOpacity>
            </View> */}

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
		top: 530
	}
})

export default EditProfileScreen