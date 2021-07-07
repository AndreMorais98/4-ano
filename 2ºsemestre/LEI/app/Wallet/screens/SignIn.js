import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import Clipboard from "expo-clipboard";

import { COLORS, SIZES, icons, images } from "../constants";
import { ModalPoup } from "../components/modal";

const ngrok = "http://10.0.2.2:8500/";

const SignIn = ({ navigation }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [resPass, setResPass] = React.useState("");
  const [erro, setErro] = React.useState("");

  function regist() {
    fetch(`${ngrok}registar`)
      .then((response) => response.json())
      .then((responseJson) => {
        setResPass(responseJson.message);
      })
      .catch(() => {
        setResPass("Problema de conexão para registo!");
      });
  }

  function login() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pkey: password }),
    };
    fetch(`${ngrok}login`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.message === "true") {
          navigation.navigate("Home", { token: responseJson.token });
          setErro("");
        } else {
          setErro("Chave privada inválida!");
        }
      })
      .catch(() => {
        setErro("Problemas de conexão!");
      });
  }

  function renderModal() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ModalPoup visible={visible}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: "100%",
                height: 5,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Image source={images.exit} style={{ height: 10, width: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              marginVertical: 5,
              fontSize: 15,
              textAlign: "center",
              color: "red",
            }}
          >
            Do not lose your private key. It is impossible to recover it, once
            you have lost it
          </Text>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ marginVertical: 0, fontSize: 20, textAlign: "center" }}
            >
              {resPass}
            </Text>
          </View>
          <View
            style={{ alignItems: "center", marginTop: 20, marginLeft: "40%" }}
          >
            <View
              style={{ width: "80%", height: 20, justifyContent: "center" }}
            >
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(resPass);
                }}
              >
                <Image
                  source={images.clipboard}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ModalPoup>
      </View>
    );
  }

  function renderLogo() {
    return (
      <View
        style={{
          mariginTop: SIZES.padding * 5,
          height: 300,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{
            width: "60%",
          }}
        />
      </View>
    );
  }

  function handlePassword(text) {
    setPassword(text);
  }

  function renderForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 3,
          marginHorizontal: SIZES.padding * 3,
        }}
      >
        {/* Password */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: "MontserratSemiBold600",
            }}
          >
            Password
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name="lock" size={25} style={{ color: "black" }} />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 10,
                marginVertical: SIZES.padding,
                borderBottomColor: COLORS.black,
                borderBottomWidth: 1,
                height: 40,
                color: COLORS.black,
                fontSize: 17,
              }}
              onChangeText={handlePassword}
              placeholder="Enter Password"
              placeholderTextColor={COLORS.black}
              selectionColor={COLORS.black}
              secureTextEntry={!showPassword}
            />
          </View>
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              bottom: 10,
              height: 30,
              width: 30,
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              source={showPassword ? icons.disable_eye : icons.eye}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.black,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginLeft: 10,
              marginVertical: SIZES.padding,

              height: 20,
              color: "#800000",
              fontSize: 14,
            }}
          >
            {erro}
          </Text>
        </View>
      </View>
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
        <View style={{ margin: SIZES.padding * 3 }}>
          <TouchableOpacity
            style={{
              height: 60,
              backgroundColor: COLORS.btn2,
              borderRadius: SIZES.radius / 1.5,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              login();
            }}
          >
            <Text
              style={{
                color: COLORS.lightgray,
                fontFamily: "Montserrat",
                fontSize: 15,
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginLeft: SIZES.padding * 3,
            marginRight: SIZES.padding * 3,
            marginBottom: SIZES.padding * 3,
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
              regist();
              setVisible(true);
            }}
          >
            <Text
              style={{
                color: COLORS.lightgray,
                fontFamily: "Montserrat",
                fontSize: 15,
              }}
            >
              Sign Up{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.lightgray, COLORS.lightgray]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {renderLogo()}
          {renderForm()}
          {renderModal()}
          {renderButton()}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
