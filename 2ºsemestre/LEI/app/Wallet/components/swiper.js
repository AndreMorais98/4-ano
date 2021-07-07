import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Swiper from "react-native-swiper";

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default function SwiperComponent(props) {
  const { link } = props;
  console.log(link);
  return (
    <Swiper
      style={styles.wrapper}
      dotStyle={{
        backgroundColor: "#000",
        borderColor: "#000",
        borderWidth: 1,
        width: 10,
        height: 10,
        borderRadius: 10,
      }}
      activeDotColor="#FFF"
      activeDotStyle={{
        borderColor: "#000",
        borderWidth: 1,
        width: 10,
        height: 10,
        borderRadius: 10,
      }}
    >
      {link.map((item) => (
        <View style={styles.slide}>
          <Image
            source={{
              uri: item.url,
            }}
            style={{ width: "100%", height: 400 }}
          />
        </View>
      ))}
    </Swiper>
  );
}
