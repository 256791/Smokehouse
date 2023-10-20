import React, { FC, useEffect } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Appbar, Divider, List, Switch, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import TemperatureController from "../components/TemperatureController";
import { setHeater, setSmoker, update } from "../redux/SmokehouseReducer";
import { RootState } from "../redux/Store";

const HomeView: FC = () => {
    const connected = useSelector((state: RootState) => state.smokehouse.connected)
    const enableHeater = useSelector((state: RootState) => state.smokehouse.enableHeater)
    const enableSmoker = useSelector((state: RootState) => state.smokehouse.enableSmoker)

    const dispatch = useDispatch();

    useEffect(() => {
        let interval = setInterval(() => {
            dispatch(update());
        }, 1000)
        return () => clearInterval(interval);
    }, [])

    return (
        <SafeAreaView>
            <Appbar.Header>
                <Appbar.Content title='Smokehouse' subtitle={connected ? 'Connected' : 'Disconected'} />
                <Appbar.Action icon={connected ? 'wifi' : 'wifi-off'} color={connected ? 'white' : 'red'} />
            </Appbar.Header>
            <ScrollView>
                <Text>{"\n"}</Text>
                <TemperatureController />
                <Divider />
                <List.Item
                    title="Enable Heater"
                    onPress={() => { dispatch(setHeater(!enableHeater)) }}
                    left={() => (
                        <List.Icon icon={'thermometer'} />
                    )}
                    right={() => (
                        <Switch value={enableHeater} disabled={!connected} onChange={() => { dispatch(setHeater(!enableHeater)) }} />
                    )}
                />
                <Divider />
                <List.Item
                    title="Enable Smoker"
                    onPress={() => { dispatch(setSmoker(!enableSmoker)) }}

                    left={() => (
                        <List.Icon icon={'fire'} />
                    )}
                    right={() => (
                        <Switch value={enableSmoker} disabled={!connected} onChange={() => { dispatch(setSmoker(!enableSmoker)) }} />
                    )}
                />
                <Divider />
            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeView;