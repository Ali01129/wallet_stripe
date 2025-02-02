import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
  return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false,animation:'ios' }} />
            <Stack.Screen name="signup" options={{ headerShown: false,animation:'ios' }} />
            <Stack.Screen name="forgetPassword" options={{ headerShown: false,animation:'ios' }} />
        </Stack>
    );
}
export default _layout
const styles = StyleSheet.create({})