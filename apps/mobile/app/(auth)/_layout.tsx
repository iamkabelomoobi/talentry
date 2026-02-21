import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

const AuthLayout = () => {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="SigninScreen" />
        <Stack.Screen name="SignupScreen" />
        <Stack.Screen name="ForgotPasswordScreen" />
        <Stack.Screen
          name="CheckEmailScreen"
          options={{ animation: "slide_from_bottom" }}
        />
      </Stack>
    </View>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
