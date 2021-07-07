import React, { useState, useRef } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Share,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Appbar } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, icons, images } from "../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
  },
  titleStyle: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  textStyle: {
    textAlign: "center",
    margin: 10,
  },
  textInputStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#51D8C7",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#51D8C7",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    padding: 10,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
});

const ngrok = "http://10.0.2.2:8500/";
const QrCode = ({ route, navigation }) => {
  const { token, certificateId, cert } = route.params;
  const [qrvalue, setQrvalue] = useState("");

  React.useEffect(() => {
    fetch(`${ngrok}qrcode/${certificateId}?token=${token}`)
      .then((response) => response.json())
      .then((responseJson) => {
        setQrvalue(responseJson.data);
      })
      .catch((e) => {
        alert(e);
      });
  }, []);

  function renderQrCode() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.titleStyle}>
            QR Code para tranferir certificado
          </Text>
          <QRCode
            // QR code value
            value={qrvalue || "NA"}
            // size of QR Code
            size={250}
            // Color of the QR Code (Optional)
            color="black"
            // Background Color of the QR Code (Optional)
            backgroundColor="white"
            // Logo of in the center of QR Code (Optional)

            // Center Logo size  (Optional)
            logoSize={30}
            // Center Logo margin (Optional)
            logoMargin={2}
            // Center Logo radius (Optional)
            logoBorderRadius={15}
            // Center Logo background (Optional)
            logoBackgroundColor="yellow"
          />
        </View>
      </SafeAreaView>
    );
  }
  function goBack() {
    navigation.navigate("Profile", { token, cert });
  }

  function renderBar() {
    return (
      <Appbar.Header style={{ backgroundColor: COLORS.btn2 }}>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Transferir" subtitle="" />
      </Appbar.Header>
    );
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.lightgray, COLORS.lightgray]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {renderBar()}
          {renderQrCode()}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
export default QrCode;
