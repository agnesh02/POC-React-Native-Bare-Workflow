import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, View, FlatList, Image, Keyboard, ScrollView, KeyboardAvoidingView } from "react-native"
import Toaster from "../../components/Toaster";
import OpenWeatherMap from "../../../api/OpenWeatherMap";

const WeatherScreen = function () {

    const [cityName, setCityName] = useState('')
    const [basicData, setBasicData] = useState([])
    const [mainData, setMainData] = useState([])
    const [windData, setWindData] = useState([])
    const [icon, setIcon] = useState('')
    const [visibility, setVisibility] = useState(false)
    const [hasData, setHasData] = useState(false)

    const initialValue = [{
        id: 0,
        name: "",
        image: "",
        feelsLike: "",
        maxTemp: "",
        minTemp: "",
        date: ""
    }
    ]

    const [forecastData, setForecastData] = useState(initialValue)

    const validate = async function () {
        setVisibility(true)
        if (cityName === '') {
            Toaster("Please enter a valid city name")
            setVisibility(false)
            return
        }

        Toaster("Fetching weather details of " + cityName)
        const currentUrl = "weather?q=" + `${cityName}` + "&APPID=b6ce0b3456949601e391e5a558343936&units=metric"
        getCurrentWeatherData(currentUrl)
    }

    const getCurrentWeatherData = async function (currentWeatherUrl) {

        try {
            const response = await OpenWeatherMap.get(currentWeatherUrl)
            const fetchedData = response.data

            setBasicData(fetchedData.weather[0])
            setMainData(fetchedData.main)
            setWindData(fetchedData.wind)
            setIcon(fetchedData.weather[0].icon)

            const forecastUrl = "forecast?q=" + `${cityName}` + "&APPID=b6ce0b3456949601e391e5a558343936&units=metric&cnt=6"
            getForecastData(forecastUrl)
        }
        catch (e) {
            Toaster("Some error occurred. Try a different city")
            setVisibility(false)
            return
        }

    }

    const getForecastData = async function (forecastWeatherUrl) {
        const response = await OpenWeatherMap.get(forecastWeatherUrl)
        const fetchedData = response.data

        const data = []

        for (let i = 1; i < 6; i++) {
            data.push({
                id: i,
                name: fetchedData.list[i].weather[0].description,
                image: fetchedData.list[0].weather[0].icon,
                feelsLike: fetchedData.list[i].main.feels_like,
                maxTemp: fetchedData.list[1].main.temp_max,
                minTemp: fetchedData.list[i].main.temp_min,
                date: fetchedData.list[i].dt_txt
            })
        }
        setForecastData(data)
        setVisibility(false)
        setHasData(true)
    }

    return (
        <View style={styling.rootContainer} behavior="height">

            <View style={styling.searchContainer}>
                <View style={styling.inputContainer}>
                    <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Enter a city" style={styling.input} onChangeText={(text) => setCityName(text.trim())} value={cityName} onPressIn={() => setHasData(false)} />
                </View>
                <TouchableOpacity style={styling.GoButton} onPress={() => { Keyboard.dismiss(); validate() }}>
                    <Text style={styling.GoButtonText}>GO</Text>
                </TouchableOpacity>
            </View>

            {visibility ? <ActivityIndicator style={{ marginTop: 50 }} size="large" /> : null}

            {hasData ?

                <View style={styling.mainCardContainer}>

                    <View style={styling.cardInfoHeader}>
                        <Image style={styling.image2} source={{ uri: "http://openweathermap.org/img/wn/" + `${icon}` + "@2x.png" }} />
                        <Text style={styling.name}>{basicData.main}</Text>
                        <Text style={{ alignSelf: "center", fontSize: 15 }}>{basicData.description}</Text>
                    </View>

                    <View style={styling.cardMain}>
                        <View style={styling.cardInfo}>
                            {Math.round(mainData.temp) >= 26 && <Image source={require("../../../assets/hot.png")} style={{ width: 40, height: 40 }} />}
                            {Math.round(mainData.temp) < 26 && <Image source={require("../../../assets/cold.png")} style={{ width: 40, height: 40 }} />}
                            <Text style={{ fontSize: 25, marginLeft: 20, marginTop: 5 }}> {`${Math.round(mainData.temp)}`}°C </Text>
                        </View>
                        <View style={styling.cardInfo}>
                            <Text style={{ fontSize: 16, marginTop: 5 }} >Feels Like: {`${Math.round(mainData.feels_like)}`}°C  </Text>
                            <Text style={{ fontSize: 16, marginLeft: 80, marginTop: 5 }} >Wind: {windData.speed} m/s</Text>
                        </View>
                        <View style={styling.cardInfo}>
                            <Text style={{ fontSize: 16, marginTop: 5, color: "red" }}>Max Temp : {`${Math.round(mainData.temp_max)}`}°C </Text>
                            <Text style={{ fontSize: 16, marginLeft: 50, marginTop: 5, color: "blue" }}>Min Temp : {`${Math.round(mainData.temp_min)}`}°C </Text>
                        </View>
                        <View style={styling.cardInfo}>
                            <Text style={{ fontSize: 16, marginTop: 10, color: "#5ea5d4" }}>Humidity : {`${Math.round(mainData.humidity)}`}%</Text>
                        </View>
                    </View>

                </View>

                : null}

            {hasData ?
                <View style={styling.parentContainer}>
                    <View style={styling.container}>
                        <FlatList
                            horizontal={true}
                            style={styling.contentList}
                            data={forecastData}
                            keyExtractor={(item) => {
                                return item.id;
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={styling.card} onPress={() => { }}>
                                        <Image style={styling.image} source={{ uri: "http://openweathermap.org/img/wn/" + `${item.image}` + "@2x.png" }} />
                                        <View style={styling.cardContent}>
                                            <Text style={styling.name}>{item.name}</Text>
                                            <Text style={styling.feelsLike}>Feels Like : </Text>
                                            <Text style={styling.feelsLikeTemp}>{`${Math.round(item.feelsLike)}`}°C</Text>
                                            <Text style={styling.maxTemp}>Max Temp : {`${Math.round(item.maxTemp)}`}°C</Text>
                                            <Text style={styling.minTemp}>Min Temp : {`${Math.round(item.minTemp)}`}°C</Text>
                                            <TouchableOpacity style={styling.followButton} onPress={() => { }}>
                                                <Text style={styling.followButtonText}>{item.date} hrs</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }} />
                    </View>
                </View>

                : null}

        </View>

    )

}

const styling = StyleSheet.create({
    rootContainer: {
        backgroundColor: "#fffafa",
        flex: 1,
    },
    searchContainer: {
        marginTop: 30,
        flexDirection: "row"
    },
    inputContainer: {
        marginLeft: 8,
        width: '75%',
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    GoButton: {
        height: 35,
        width: 60,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "blue",
        alignSelf: "center"
    },
    GoButtonText: {
        color: "white",
        fontSize: 15,
    },
    cardInfoHeader: {
        marginTop: 10,
        flex: 0.4,
        alignSelf: "center",
        padding: 10
    },
    mainCardContainer: {
        flex: 0.58,
        alignItems: "center",
    },
    cardMain: {
        flex: 0.48,
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 30,
        marginVertical: 20,
        borderWidth: 2,
        borderColor: "#9900ff"
    },
    cardInfo: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "center"
    },
    parentContainer: {
        flex: 0.4,
        justifyContent: "flex-end"
    },
    container: {
        flex: 1,
        backgroundColor: "#ebf0f7",
        marginBottom: 10
    },
    contentList: {
        flex: 1
    },
    cardContent: {
        marginLeft: 5,
        marginTop: 10
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: "#ebf0f7"
    },
    image2: {
        width: 60,
        height: 60,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: "#ebf0f7",
        alignSelf: "center"
    },
    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        marginLeft: 20,
        marginRight: 20,
        marginVertical: 20,
        backgroundColor: "white",
        padding: 10,
        flexDirection: "row",
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#b1202f"
    },
    name: {
        fontSize: 18,
        flex: 1,
        alignSelf: 'center',
        color: "#3399ff",
        fontWeight: 'bold'
    },
    feelsLike: {
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
        alignSelf: 'center',
        color: "purple"
    },
    feelsLikeTemp: {
        marginTop: -10,
        fontSize: 18,
        flex: 1,
        alignSelf: 'center',
        color: "violet"
    },
    maxTemp: {
        fontSize: 14,
        flex: 1,
        alignSelf: 'center',
        color: "red",
        marginLeft: -55,
        marginTop: 0
    },
    minTemp: {
        fontSize: 14,
        flex: 1,
        alignSelf: 'center',
        color: "blue",
        marginLeft: -55,
        marginTop: -5
    },
    followButton: {
        marginTop: 5,
        marginLeft: -55,
        height: 35,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "red",
        alignSelf: "center"
    },
    followButtonText: {
        color: "blue",
        fontSize: 12,
    }
});

export default WeatherScreen