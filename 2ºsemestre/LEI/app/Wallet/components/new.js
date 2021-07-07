import React from "react";
import { View, Text, StyleSheet, Image, useColorScheme } from "react-native";
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
    fontSize: 14,
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
    color: "#4f4a4a",
    fontFamily: "Montserrat",
  },
  footer: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
    width: "100%",
  },
  price: {
    fontFamily: "MontserratBold700",
    fontSize: 14,
  },
});

export default function New(props) {
  const { onPress, cover, description, name, brand, token, navigation, cert } =
    props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={{
          uri: cover,
        }}
        style={styles.cover}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.footer}>
        <View style={{ width: "80%" }}>
          <Text style={styles.price}>{brand}</Text>
        </View>
        <View style={{ width: "20%" }}>
          <Ionicons
            name="ios-add-circle"
            size={24}
            color="#45433d"
            onPress={() => navigation.navigate("Profile", { token, cert })}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
