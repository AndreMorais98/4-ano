import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { SignIn, Home, Scan, Profile, History, QrCode } from "./screens";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  },
};

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat.ttf"),
    MontserratBold700: require("./assets/fonts/MontserratBold700.ttf"),
    MontserratSemiBold600: require("./assets/fonts/MontserratSemiBold600.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SignIn"
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="QrCode" component={QrCode} />

        {/* <Stack.Screen name="Scan" component={Scan} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
