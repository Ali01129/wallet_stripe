import { StyleSheet, Text, View,Alert } from "react-native";
import React, { useState } from "react";
import { ColorPalette } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { router } from "expo-router";
import CustomSolidButton from "@/components/CustomSolidButton";
import { SendCard2 } from "@/components/SendCard";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import InputField from "@/components/inputFieldSendCard";
import Images from "@/constants/Images";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BASE_URL from "@/utills";

//stripe
import { StripeProvider } from "@stripe/stripe-react-native";
import { useStripe } from "@stripe/stripe-react-native";

//for token
import { getData } from "../storage";

interface FormValues {
  amount: number;
  selectedCard: boolean;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .min(10, "Amount must be greater than 10"),
  selectedCard: Yup.boolean().oneOf([true], "Payment method is required"),
});

const Deposit: React.FC = () =>  {

  const initialValues: FormValues = {
    amount: 0,
    selectedCard: false,
  };
  const [selectedCard, setSelectedCard] = useState(false);
  //stripe
  const {initPaymentSheet,presentPaymentSheet}=useStripe();

  const handleSubmit = async (
    values: FormValues,
  ) => {

    //create payment intent
    const response = await fetch(`${BASE_URL}/wallet/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: values.amount }),
    });
    if(response.status !== 200){
      Alert.alert("Error", "Something went wrong");
      return;
    }
    const data = await response.json();

    //initialize payment sheet
    const initResponse=await initPaymentSheet({
      merchantDisplayName:"SmartInvest",
      paymentIntentClientSecret:data.client_secret
    });
    if(initResponse.error){
      Alert.alert("Error", "Something went wrong");
      return;
    }
    //present payment sheet form stripe
    const payment=await presentPaymentSheet();
    if(payment.error){
      Alert.alert("Error", "Something went wrong");
      return;
    }
    //if payment is successful
    deposit(values.amount);
  };

  const deposit = async (amount: number) => {
    const retrievedData:any = await getData();
    const parsedData = JSON.parse(retrievedData);
    try {
      const response = await fetch(`${BASE_URL}/transaction/deposit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": parsedData.token,
        },
        body: JSON.stringify({ amount: amount }),
      });
  
      if (response.ok) {
        Alert.alert("Deposit successful","Your wallet will be updated shortly");
      } else {
        const errorData = await response.json();
        Alert.alert("Deposit failed", errorData.message || "An unknown error occurred.");
      }
    } catch (error) {
      Alert.alert("Deposit failed", "An error occurred while making the request.");
      console.error("Deposit error:", error);
    } finally {
      router.push("home");
    }
  }
  

  //stripe public key
  const stripePublicKey = 'pk_test_51PhaFTKzthS38P3sglLQ2HViHhTELRwHJKOkAqj9iKUeJ8RT181WWxk4alZPqYrobRUacKePbYqTgaRL1cL2EXSA00f0EsVqeI';

  return (
    <SafeAreaView style={styles.container}>
      <StripeProvider publishableKey={stripePublicKey}>
      <Header title="Deposit" onPress={() => router.push("home")} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({handleChange,handleBlur,handleSubmit,setFieldValue,values,errors,touched,}) => (
          <>
            <SendCard2
              BoxName="Payment Method"
              imageNoStyle={Images.stripe}
              onPress={() => {
                setSelectedCard(!selectedCard);
                setFieldValue("selectedCard", !selectedCard);
              }}
              selected={selectedCard}
            />
            {touched.selectedCard && errors.selectedCard && (
              <Text style={{ color: "red", marginBottom: 5 }}>
                {errors.selectedCard}
              </Text>
            )}
            <KeyboardAwareScrollView style={{ width: "100%" }}>
              <InputField
                name="Amount"
                placeholder="Enter amount"
                onChangeText={handleChange("amount")}
                onBlur={() => handleBlur("amount")}
                onFocus={() =>{}}
                value={values.amount}
                icon={"dollar"}
                keyType="numeric"
              />
              {touched.amount && errors.amount && (
                <Text style={{ color: "red", marginBottom: 5 }}>
                  {errors.amount}
                </Text>
              )}

              <View style={styles.buttonWrapper}>
                <CustomSolidButton
                  text={"Deposit"}
                  onPress={() => handleSubmit()}
                  gradientColors={[ColorPalette.g2, ColorPalette.secondary]}
                  textColor={ColorPalette.textBlack}
                />
              </View>
            </KeyboardAwareScrollView>
          </>
        )}
      </Formik>
      <StatusBar backgroundColor={ColorPalette.background} style="light" />
      </StripeProvider>
    </SafeAreaView>
  );
};

export default Deposit;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: ColorPalette.background,
    padding: 16,
  },
  label: {
    color: 'white',
    fontSize: 18,
    marginTop:20
  },
  buttonWrapper: {
    justifyContent: "center",
    alignContent: "flex-end",
    marginTop: 20,
  },
});
