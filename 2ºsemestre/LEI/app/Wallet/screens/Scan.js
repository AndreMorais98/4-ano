import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";

const finderWidth = 280;

const finderHeight = 230;

const { width } = Dimensions.get("window");

const { height } = Dimensions.get("window");

const viewMinX = (width - finderWidth) / 2;

const viewMinY = (height - finderHeight) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

const ngrok = "http://10.0.2.2:8500/";

const Scan = ({ route, navigation }) => {
  const { token } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.Type.back);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  function transfer(id, pass) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase: pass, certificateId: id }),
    };
    fetch(`${ngrok}transfere?token=${token}`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.message === "true") {
          alert("Transferência concluida");
        } else {
          alert("Erro na transfrência");
        }
      })
      .catch(() => {
        alert("Problemas de conexão!");
      });
  }

  const handleBarCodeScanned = (scanningResult) => {
    if (!scanned) {
      const { type, data, bounds: { origin } = {} } = scanningResult;

      // @ts-ignore

      const { x, y } = origin;

      if (
        x >= viewMinX &&
        y >= viewMinY &&
        x <= viewMinX + finderWidth / 2 &&
        y <= viewMinY + finderHeight / 2
      ) {
        setScanned(true);

        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        const id = data.split("/")[3].split(",")[0];
        const pass = data.split("/")[3].split(",")[1];
        transfer(id, pass);
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.padding * 4,
          paddingHorizontal: SIZES.padding * 3,
        }}
      >
        <TouchableOpacity
          style={{
            width: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("Home", { token })}
        >
          <Image
            source={icons.close}
            style={{ height: 20, width: 20, tintColor: COLORS.white }}
          />
        </TouchableOpacity>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
            Scan para obter certificado
          </Text>
        </View>
      </View>
    );
  }

  function renderScanFocus() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={images.focus}
          resizeMode="stretch"
          sytle={{
            marginTop: "-55",
            width: 200,
            height: 300,
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        type={type}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      >
        <View
          style={{
            flex: 1,

            backgroundColor: "transparent",

            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,

              alignItems: "flex-end",
            }}
            onPress={() => {
              setType(
                type === BarCodeScanner.Constants.Type.back
                  ? BarCodeScanner.Constants.Type.front
                  : BarCodeScanner.Constants.Type.back
              );
            }}
          >
            {renderHeader()}
            <Text style={{ fontSize: 18, margin: 5, color: "white" }}>
              {" "}
              Flip{" "}
            </Text>
          </TouchableOpacity>
        </View>

        <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />

        {scanned && (
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        )}
      </BarCodeScanner>
    </View>
  );
};

export default Scan;
