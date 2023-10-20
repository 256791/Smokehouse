import React, { FC, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Button, List, Text, TouchableRipple } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setTemperature } from "../redux/SmokehouseReducer";
import { RootState } from "../redux/Store";
import Controller, { status } from "../utils/SmokehouseController";


const TemperatureController: FC = () => {
    const temperature = useSelector((state: RootState) => state.smokehouse.temperature);
    const target = useSelector((state: RootState) => state.smokehouse.target);
    const enableHeater = useSelector((state: RootState) => state.smokehouse.enableHeater);
    const connected = useSelector((state: RootState) => state.smokehouse.connected)
    const dispatch = useDispatch();

    var boeder: ViewStyle = { borderColor: '#000000' };
    if (enableHeater) {
        if (temperature + 5 < target) boeder.borderColor = '#0000FF';
        else if (temperature - 5 > target) boeder.borderColor = '#FF0000';
        else boeder.borderColor = '#00FF00';
    }

    return (
        <View>
            <View style={[styles.circle, boeder]}>
                <Text style={{ fontSize: 35 }}>{temperature}°C</Text>
                <Text style={{ fontSize: 25 }}>/{target}°C</Text>

            </View>
            <View style={styles.regulation}>
                <TouchableRipple
                    disabled={!connected}
                    style={styles.button}
                    onPress={() => { dispatch(setTemperature(target + 5)); }}
                >
                    <List.Icon icon='thermometer-plus' />
                </TouchableRipple>
                <TouchableRipple
                    disabled={!connected}
                    style={styles.button}
                    onPress={() => { dispatch(setTemperature(target - 5)); }}
                >
                    <List.Icon icon='thermometer-minus' />
                </TouchableRipple>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    circle: {
        color: '#ff00ff',
        height: 200,
        width: 200,
        alignSelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 10,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: '#000000'
    },
    regulation: {
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 10
    },
    text: {
        fontSize: 30
    },
    button: {
        marginTop: 10,
        marginHorizontal: 50,
        fontSize: 20
    }
})

export default TemperatureController