import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import Stars from "react-native-stars";
import { Appbar } from "react-native-paper";

import { StatusBar } from "expo-status-bar";
import React, { useState, Component } from "react";
import Timeline from "react-native-timeline-flatlist";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, icons, images } from "../constants";

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 40,
  },

  listStyle: {
    flex: 1,
    marginTop: 40,
    marginLeft: -60,
  },

  text: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 20,
  },
});

const ngrok = "http://10.0.2.2:8500/";

const History = ({ route, navigation }) => {
  const { token, certificateId, name, cert } = route.params;
  const [historyData, setHistoryData] = useState([]);

  React.useEffect(() => {
    fetch(`${ngrok}history/${certificateId}?token=${token}`)
      .then((response) => response.json())
      .then((responseJson) => {
        setHistoryData(responseJson.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function goBack() {
    navigation.navigate("Profile", { token, cert });
  }

  function renderBar() {
    return (
      <Appbar.Header style={{ backgroundColor: COLORS.btn2 }}>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Histórico" subtitle="" />
      </Appbar.Header>
    );
  }
  function renderTimeLine() {
    return (
      <View>
        <Text style={styles.text}>{name}</Text>
        <View style={styles.MainContainer}>
          <Timeline // ..other props
            circleSize={20}
            circleColor="rgb(45,156,219)"
            lineColor="rgb(45,156,219)"
            timeContainerStyle={{ minWidth: 52, marginTop: 0 }}
            timeStyle={{
              textAlign: "center",
              backgroundColor: "#ff9797",
              color: "white",
              padding: 5,
              borderRadius: 13,
            }}
            descriptionStyle={{ color: "gray" }}
            options={{
              style: { paddingTop: 20 },
            }}
            data={historyData}
          />
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
          {renderBar()}
          {renderTimeLine()}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default History;
