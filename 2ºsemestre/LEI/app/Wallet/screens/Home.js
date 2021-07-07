import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Appbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import New from "../components/new";
import Not from "../components/not";
import { COLORS, SIZES, icons, images } from "../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightgray,
  },
  sectionHeader: {
    fontWeight: "800",
    fontSize: SIZES.h4,
    color: COLORS.black,
    marginTop: 20,
    marginBottom: 5,
    fontFamily: "MontserratBold700",
  },
  item: {
    margin: 10,
  },
  itemPhoto: {
    width: 200,
    height: 200,
  },
  itemText: {
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 5,
  },
  container2: {
    flex: 1,
  },
  scrollView2: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
});
const ngrok = "http://10.0.2.2:8500/";
const Home = ({ route, navigation }) => {
  const { token } = route.params;
  const [products, setProducts] = useState();
  const [notificacoes, setNotificacoes] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshing2, setRefreshing2] = React.useState(false);

  const onRefresh2 = React.useCallback(() => {
    console.log("ss");
    setRefreshing2(true);
    fetch(`${ngrok}products?token=${token}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.message);
        setProducts(responseJson.message.data);
        setRefreshing2(false);
      })
      .catch(() => {
        console.error("Problema de conexão para prods!");
      });
  }, []);

  const onRefresh = React.useCallback(() => {
    console.log("ss");
    setRefreshing(true);
    fetch(`${ngrok}products?token=${token}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.message);
        setProducts(responseJson.message.data);
        setRefreshing(false);
      })
      .catch(() => {
        console.error("Problema de conexão para prods!");
      });
  }, []);

  React.useEffect(() => {
    fetch(`${ngrok}products?token=${token}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.message);
        setProducts(responseJson.message.data);
      })
      .catch(() => {
        console.error("Problema de conexão para prods!");
      });
  }, []);

  React.useEffect(() => {
    fetch(`${ngrok}notificacoes?token=${token}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setNotificacoes(responseJson.data);
      })
      .catch(() => {
        console.error("Problema de conexão para not!");
      });
  }, []);

  function goBack() {
    navigation.navigate("SignIn");
  }
  const t = "qr";
  function renderBar() {
    return (
      <Appbar.Header style={{ backgroundColor: COLORS.btn2 }}>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="HomePage" subtitle="" />
        <Appbar.Action
          icon="qrcode"
          onPress={() => navigation.navigate("Scan", { token, t })}
        />
      </Appbar.Header>
    );
  }

  function renderProducts() {
    return (
      <View style={styles.container}>
        <StatusBar style={{ color: "light" }} />
        <SafeAreaView style={{ flex: 1 }}>
          <SectionList
            contentContainerStyle={{ paddingHorizontal: 10 }}
            stickySectionHeadersEnabled={false}
            sections={SECTIONS}
            renderSectionHeader={({ section }) => (
              <>
                <Text style={styles.sectionHeader}>Meus Produtos</Text>
                <View
                  style={{
                    backgroundColor: "#A2A2A2",
                    height: 2,
                  }}
                />
                <FlatList
                  horizontal
                  data={products}
                  renderItem={({ item }) => <ListItem item={item} />}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              </>
            )}
            renderItem={({ item, section }) => null}
          />
        </SafeAreaView>
      </View>
    );
  }

  function renderNotifications() {
    return (
      <View style={styles.container}>
        <StatusBar style={{ color: "light" }} />
        <SafeAreaView style={{ flex: 1 }}>
          <SectionList
            contentContainerStyle={{ paddingHorizontal: 10 }}
            stickySectionHeadersEnabled={false}
            sections={SECTIONS}
            renderSectionHeader={({ section }) => (
              <>
                <Text style={styles.sectionHeader}>Notificações</Text>
                <View
                  style={{
                    backgroundColor: "#A2A2A2",
                    height: 2,
                  }}
                />

                <FlatList
                  horizontal
                  data={notificacoes}
                  renderItem={({ item }) => <ListItemNot item={item} />}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing2}
                      onRefresh={onRefresh2}
                    />
                  }
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}
            renderItem={({ item, section }) => null}
          />
        </SafeAreaView>
      </View>
    );
  }

  const SECTIONS = [
    {
      title: "Made for you",
      data: [
        {
          key: "1",
          text: "Item text 1",
          uri: "https://picsum.photos/id/1/200",
        },
        {
          key: "2",
          text: "Item text 2",
          uri: "https://picsum.photos/id/10/200",
        },

        {
          key: "3",
          text: "Item text 3",
          uri: "https://picsum.photos/id/1002/200",
        },
        {
          key: "4",
          text: "Item text 4",
          uri: "https://picsum.photos/id/1006/200",
        },
        {
          key: "5",
          text: "Item text 5",
          uri: "https://picsum.photos/id/1008/200",
        },
      ],
    },
  ];

  function ListItem({ item }) {
    return (
      <New
        cover={item.content.medias[0].url}
        name={item.content.name}
        description={item.content.description}
        brand={item.content.manufacturingCountry}
        token={token}
        navigation={navigation}
        cert={item}
      />
    );
  }

  function ListItemNot({ item }) {
    console.log(item);
    return (
      <Not
        title={item.content.title}
        description={item.content.description}
        link={item.content.link}
        mesId={item.id}
        token={token}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.lightgray, COLORS.lightgray]}
        style={{ flex: 1 }}
      >
        {renderBar()}
        {renderProducts()}
        {renderNotifications()}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Home;
