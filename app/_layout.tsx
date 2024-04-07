import { LogBox, StatusBar, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

import Container from "@/components/container";
import { Provider } from "react-redux";
import store, { persistor } from "@/redux-store/store";
import { PersistGate } from "redux-persist/integration/react";

const _layout = () => {
  LogBox.ignoreAllLogs();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <SafeAreaView style={styles.container}>
          <Container>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </Container>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default _layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
