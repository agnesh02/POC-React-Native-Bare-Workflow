import React from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native"

const DashboardScreen = function ({ navigation }) {

	const onItemClick = function (title) {
		switch (title) {
			case "Weather":
				navigation.navigate("Weather")
				return
			case "Find & Connect":
				navigation.navigate("Bluetooth")
				return
			case "Profile":
				navigation.navigate("Profile")
				return
			case "Stream Video":
				navigation.navigate("Live Stream")
				return
		}
	}

	const data = [
		{ id: 1, title: "Weather", color: "#FF4500", image: require("../../../assets/cloudy-day.png") },
		{ id: 2, title: "Find & Connect", color: "#87CEEB", image: require("../../../assets/bluetooth.png") },
		{ id: 3, title: "Profile", color: "#4682B4", image: require("../../../assets/user.png") },
		{ id: 4, title: "Stream Video", color: "#6A5ACD", image: require("../../../assets/live.png") },
	]

	return (
		<View style={styling.container}>
			<FlatList style={styling.list}
				contentContainerStyle={styling.listContainer}
				data={data}
				horizontal={false}
				numColumns={2}
				keyExtractor={(item) => {
					return item.id;
				}}
				renderItem={({ item }) => {
					return (
						<View>
							<TouchableOpacity style={[styling.card, { backgroundColor: item.color }]} onPress={() => onItemClick(item.title)}>
								<Image style={styling.cardImage} source={item.image} />
							</TouchableOpacity>

							<View style={styling.cardHeader}>
								<View style={{ alignItems: "center", justifyContent: "center" }}>
									<Text style={[styling.title, { color: item.color }]}>{item.title}</Text>
								</View>
							</View>
						</View>
					)
				}}
			/>
		</View>
	)
}

const styling = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	list: {
		alignContent: "center",
		marginTop: 50,
		paddingHorizontal: 5,
		backgroundColor: "#fff",
	},
	listContainer: {
		justifyContent: "center",
		alignItems: 'center',
	},
	/******** card **************/
	card: {
		shadowColor: '#474747',
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,

		elevation: 12,
		marginTop: 50,
		// marginVertical: 20,
		marginHorizontal: 30,
		backgroundColor: "#e2e2e2",
		//flexBasis: '42%',
		width: 120,
		height: 120,
		borderRadius: 60,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cardHeader: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderTopLeftRadius: 1,
		borderTopRightRadius: 1,
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: "center"
	},
	cardContent: {
		paddingVertical: 12.5,
		paddingHorizontal: 16,
	},
	cardFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 12.5,
		paddingBottom: 25,
		paddingHorizontal: 16,
		borderBottomLeftRadius: 1,
		borderBottomRightRadius: 1,
	},
	cardImage: {
		height: 50,
		width: 50,
		alignSelf: 'center'
	},
	title: {
		fontSize: 24,
		flex: 1,
		alignSelf: 'center',
		fontWeight: 'bold'
	}
})

export default DashboardScreen