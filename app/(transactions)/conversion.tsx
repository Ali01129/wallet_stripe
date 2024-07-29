import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette } from "@/constants/Colors";
import React, { useCallback, useState } from "react";
import Numpad from "@/components/numpad";
import CustomSolidButton from "@/components/CustomSolidButton";
import Header from "@/components/header";
import { router } from "expo-router";
import ConversionInputField from "@/components/conversionInputField";
import SwapButton from "@/components/swapButton";
import { StatusBar } from "expo-status-bar";
import { getData } from "../storage";
import BASE_URL from "@/utills";

const Conversion = () => {
  const [dollarValue, setDollarValue] = useState<string>("");
  const [coinValue, setCoinValue] = useState<string>("");
  const [isFirstDollar, setIsFirstDollar] = useState<boolean>(true);
  const [isFirstFocused, setIsFirstFocused] = useState<boolean>(false);
  const [isSecondFocused, setIsSecondFocused] = useState<boolean>(false);
  const dollarToCoinRate = 5;
  const coinToDollar = 0.2;

  const handleNumpadPress = (button: string) => {
    if (isFirstFocused && isFirstDollar) {
      if (button === "<") {
        setDollarValue(dollarValue.slice(0, -1));
      } else {
        setDollarValue(dollarValue + button);
      }
    } else if (isFirstFocused && !isFirstDollar) {
      if (button === "<") {
        setCoinValue(coinValue.slice(0, -1));
      } else {
        setCoinValue(coinValue + button);
      }
    } else if (isSecondFocused && isFirstDollar) {
      if (button === "<") {
        setCoinValue(coinValue.slice(0, -1));
      } else {
        setCoinValue(coinValue + button);
      }
    } else if (isSecondFocused && !isFirstDollar) {
      if (button === "<") {
        setDollarValue(dollarValue.slice(0, -1));
      } else {
        setDollarValue(dollarValue + button);
      }
    }
  };

  // to handle focus on input fields
  const handleInputFocus = (isFirstField: boolean) => {
    // to handle dynamic conversion
    setCoinValue("");
    setDollarValue("");

    setIsFirstFocused(isFirstField);
    setIsSecondFocused(!isFirstField);
  };

  // to convert dynamically
  const calculateValue = (bool: boolean): string => {
    if (bool) {
      if (coinValue) {
      
        return (+coinValue * coinToDollar).toString();
      } else {
        return dollarValue;
      }
    } else {
      if (dollarValue) {
        return (+dollarValue * dollarToCoinRate).toString();
      } else {
        return coinValue;
      }
    }
  };

  // setting field values dynamically
  const createFieldProps = useCallback(
    (isFirst: boolean) => ({
      icon: isFirstDollar === isFirst ? "dollar-sign" : "coins",
      placeholder:
        isFirstDollar === isFirst ? "Enter dollar amount" : "Enter coin amount",
      onChangeText: isFirstDollar === isFirst ? setDollarValue : setCoinValue,
      value: calculateValue(isFirstDollar === isFirst),
      focused: isFirst ? isFirstFocused : isSecondFocused,
      onFocus: () => handleInputFocus(isFirst),
    }),
    [isFirstDollar, isFirstFocused, isSecondFocused, calculateValue]
  );

  const handleConvert = async () => {
    try {
      const retrievedData: any = await getData();
      if (!retrievedData) {
        throw new Error('Failed to retrieve data');
      }
      const parsedData = JSON.parse(retrievedData);
      const token: any = parsedData.token;
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await fetch(`${BASE_URL}/transaction/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({
          amount: isFirstDollar ? dollarValue : coinValue,
          DtoSc: isFirstDollar,
        }),
      });
      const data = await response.json();
      if (data.status==='error') {
        Alert.alert('Error', data.error);
      } else {
        Alert.alert('Success', 'Conversion successful');
      }
    } catch (error:any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    }
    finally {
      router.push('home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Convert"
        onPress={() => {
          router.replace("home");
        }}
      />
      <View style={styles.formBox}>
        <ConversionInputField {...createFieldProps(true)} />
        <SwapButton onPress={() => setIsFirstDollar(!isFirstDollar)} />
        <ConversionInputField {...createFieldProps(false)} />
      </View>

      <Numpad onPress={handleNumpadPress} />

      <CustomSolidButton
        gradientColors={[ColorPalette.g2, ColorPalette.secondary]}
        text={"Convert"}
        textColor={ColorPalette.background}
        onPress={() => handleConvert()}
      />
      <StatusBar backgroundColor={ColorPalette.background} style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: ColorPalette.text,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: ColorPalette.background,
    padding: 16,
    paddingBottom: 16,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formBox: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default Conversion;
