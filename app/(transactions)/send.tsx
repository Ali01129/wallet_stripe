import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette } from "@/constants/Colors";
import Header from "@/components/header";
import { router } from "expo-router";
import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";
import InputField from "@/components/inputFieldSendCard";
import Images from "@/constants/Images";
import SendCard from "@/components/SendCard";
import CustomSolidButton from "@/components/CustomSolidButton";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BASE_URL from "@/utills";
import {getData} from '../storage';

interface FormValues {
  address: string;
  amount: number;
}
const validationSchema = Yup.object().shape({
  address: Yup.string().required("Address is required"),
  amount: Yup.number().required("Amount is required"),
});

const Send: React.FC = () =>  {
  const initialValues: FormValues = {
    address:'',
    amount:0,
  };
  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
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
      const response = await fetch(`${BASE_URL}/transaction/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({
          address: values.address,
          amount: values.amount,
        }),
      });
      const data = await response.json();
      if (data.status==='error') {
        Alert.alert('Error', data.error);
      } else {
        Alert.alert('Success', 'Transaction successful');
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
      <Header title="Send" onPress={() => router.push("home")} />
      <SendCard
        title="From"
        address="0x4564879848..7878"
        image={Images.amongus}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <KeyboardAwareScrollView style={{ width: "100%" }}>
            <InputField
              name="Address"
              placeholder="Enter recipient's address"
              onChangeText={handleChange("address")}
              onBlur={() => handleBlur("address")}
              onFocus={() => console.log("Input focused")}
              value={values.address}
              icon={"person"}
            />
            {touched.address && errors.address && (
              <Text style={{ color: "red", marginBottom: 10 }}>
                {errors.address}
              </Text>
            )}

            <InputField
              name="Amount"
              placeholder="Enter amount"
              onChangeText={handleChange("amount")}
              onBlur={() => handleBlur("amount")}
              onFocus={() => {}}
              value={values.amount}
              icon={"dollar"}
              keyType="numeric"
            />
            {touched.amount && errors.amount && (
              <Text style={{ color: "red", marginBottom: 10 }}>
                {errors.amount}
              </Text>
            )}

            <View style={{justifyContent: "center",alignContent: "flex-end",}}>
              <CustomSolidButton
                text={"Send"}
                onPress={() => handleSubmit()}
                gradientColors={[ColorPalette.g2, ColorPalette.secondary]}
                textColor={ColorPalette.textBlack}
              />
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>
      <StatusBar backgroundColor={ColorPalette.background} style="light" />
    </SafeAreaView>
  );
};

export default Send;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: ColorPalette.background,
    padding: 16,
  },
  logInText: {
    color: ColorPalette.background,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  gradient: {
    borderRadius: 16,
    marginTop: 10,
    padding: 15,
    width: "100%",
    backgroundColor: ColorPalette.secondary,
  },
});
