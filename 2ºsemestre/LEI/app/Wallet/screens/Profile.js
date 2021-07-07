import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import Stars from "react-native-stars";
import { Appbar } from "react-native-paper";
import { COLORS, SIZES, icons, images } from "../constants";
import SwiperComponent from "../components/swiper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  swiperContent: {
    flexDirection: "row",
    height: 340,
    width: "100%",
  },
  headerContent: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  house: {
    fontFamily: "MontserratBold700",
    fontSize: 18,
    color: "#4f4a4a",
  },
  rating: {
    fontFamily: "MontserratSemiBold600",
    fontSize: 9,
    color: "#4f4a4a",
  },
  myStarStyle: {
    color: "#E7A74e",
    backgroundColor: "transparent",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  price: {
    paddingHorizontal: 20,
    fontFamily: "MontserratSemiBold600",
    fontSize: 14,
    color: "#000",
  },
  country: {
    paddingHorizontal: 20,
    fontFamily: "MontserratSemiBold600",
    fontSize: 16,
    color: "#000",
  },
  description: {
    fontFamily: "MontserratBold700",
    paddingHorizontal: 20,
    color: "#b3aeae",
    fontSize: 14,
    lineHeight: 15,
    marginTop: 15,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    height: 90,
    borderRadius: 8,
    marginRight: 20,
  },
});

const Profile = ({ route, navigation }) => {
  const { token } = route.params;
  const { cert } = route.params;
  const certificateId = cert.certificateId;
  const name = cert.content.name;
  console.log(cert);
  function goBack() {
    navigation.navigate("Home", { token });
  }
  const type = "event";
  function renderBar() {
    return (
      <Appbar.Header style={{ backgroundColor: COLORS.btn2 }}>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Profile" subtitle="" />
        <Appbar.Action
          icon="qrcode"
          onPress={() => navigation.navigate("Scan", { token, type })}
        />
      </Appbar.Header>
    );
  }
  function renderButton() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          marginTop: 25,
        }}
      >
        <View style={{ margin: SIZES.padding * 2 }}>
          <TouchableOpacity
            style={{
              height: 60,
              backgroundColor: COLORS.btn2,
              borderRadius: SIZES.radius / 1.5,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              navigation.navigate("History", {
                token,
                certificateId,
                name,
                cert,
              })
            }
          >
            <Text
              style={{
                color: COLORS.lightgray,
                fontFamily: "Montserrat",
                fontSize: 15,
              }}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginLeft: SIZES.padding * 2,
            marginRight: SIZES.padding * 2,
            marginBottom: SIZES.padding * 2,
            marginTop: SIZES.padding * -1.5,
          }}
        >
          <TouchableOpacity
            style={{
              height: 60,
              backgroundColor: COLORS.btn1,
              borderRadius: SIZES.radius / 1.5,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              navigation.navigate("QrCode", { token, certificateId, cert });
            }}
          >
            <Text
              style={{
                color: COLORS.lightgray,
                fontFamily: "Montserrat",
                fontSize: 15,
              }}
            >
              Transferir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (cert.content.attributes[0].value === "Gold") {
    return (
      <View style={styles.container}>
        {renderBar()}
        <ScrollView>
          <View style={styles.swiperContent}>
            <SwiperComponent link={cert.content.medias} />
          </View>

          <View style={styles.headerContent}>
            <View style={{ width: "65%" }}>
              <Text style={styles.house}>{cert.content.name}</Text>
            </View>
          </View>
          <Text style={styles.country}>
            {cert.content.manufacturingCountry}
          </Text>

          <Text style={styles.description}>{cert.content.description}</Text>
          <View
            style={{
              marginTop: 50,
              width: "100%",
              height: 5,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text style={styles.price}>
              Ano: {cert.content.attributes[1].value}
            </Text>
            <Text style={styles.price}>
              Pureza: {cert.content.materials[0].pourcentage}
            </Text>
            <Text style={styles.price}>
              Peso: {cert.content.size[0].value} {cert.content.size[0].unit}
            </Text>
            <Text style={styles.price}>
              Número de série: {cert.content.serialnumber[0].value}
            </Text>
          </View>
          {renderButton()}
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderBar()}
      <ScrollView>
        <View style={styles.swiperContent}>
          <SwiperComponent link={cert.content.medias} />
        </View>

        <View style={styles.headerContent}>
          <View style={{ width: "65%" }}>
            <Text style={styles.house}>{cert.content.name}</Text>
          </View>
        </View>
        <Text style={styles.country}>{cert.content.manufacturingCountry}</Text>

        <Text style={styles.description}>{cert.content.description}</Text>
        <View
          style={{
            marginTop: 50,
            width: "100%",
            height: 5,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text style={styles.price}>
            Material: {cert.content.materials[0].material}
          </Text>
          <Text style={styles.price}>
            Tamanho: {cert.content.size[0].value} - {cert.content.size[0].unit}
          </Text>
          <Text style={styles.price}>Marca: {cert.content.subBrand}</Text>
          <Text style={styles.price}>
            Tipo: {cert.content.attributes[0].value}
          </Text>
        </View>
        {renderButton()}
      </ScrollView>
    </View>
  );
};

export default Profile;
