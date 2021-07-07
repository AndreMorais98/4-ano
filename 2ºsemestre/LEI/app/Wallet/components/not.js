import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useColorScheme,
  Linking,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, icons, images } from "../constants";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: COLORS.btn1,
    height: 250,
    width: 200,
    elevation: 2,
    borderRadius: 10,
    padding: 15,
    marginRight: 30,
    marginLeft: 2,
    marginBottom: 5,
    fontFamily: "RobotoBlack",
  },
  itemPhoto: {
    width: 200,
    height: 200,
  },
  cover: {
    width: 170,
    height: 110,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    color: "#4f4a4a",
    fontFamily: "MontserratBold700",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "red",
    marginHorizontal: 4,
  },
  badge: {
    color: "red",
    fontSize: 9,
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    color: "#4f4a4a",
    fontFamily: "Montserrat",
  },
  footer: {
    flexDirection: "row",
    marginTop: 50,
    alignItems: "center",
    width: "100%",
  },
  link: {
    fontFamily: "MontserratBold700",
    marginTop: 20,
    fontSize: 14,
  },
});

export default function Not(props) {
  const { onPress, link, description, title, mesId, token } = props;

  function markasRead() {
    console.log(mesId);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: mesId }),
    };
    fetch(`http://f227a361b4fe.ngrok.io/read?token=${token}`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {})
      .catch(() => {});
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={{
          width: "100%",
          height: 5,
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={() => markasRead()}>
          <Image source={icons.close} style={{ height: 10, width: 10 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.footer}>
        <View style={{ width: "80%" }}>
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL({ link })}
          >
            Saiba mais
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
