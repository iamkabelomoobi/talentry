import { useAuthAnimations } from "@/hooks/use-auth-animations";
import { authStyles, colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  const visible = local.slice(0, 2);
  const masked = "*".repeat(Math.max(local.length - 2, 3));
  return `${visible}${masked}@${domain}`;
};

const CheckEmailScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const email = Array.isArray(params.email)
    ? (params.email[0] ?? "")
    : (params.email ?? "");

  const { formFadeAnim, formSlideAnim, logoFadeAnim, logoScaleAnim } =
    useAuthAnimations();

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <KeyboardAvoidingView
        style={authStyles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 24}
      >
        <ScrollView
          contentContainerStyle={[
            authStyles.scrollContent,
            styles.scrollContent,
          ]}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          <Animated.View
            style={[
              authStyles.imageContainer,
              styles.imageContainer,
              {
                opacity: logoFadeAnim,
                transform: [{ scale: logoScaleAnim }],
              },
            ]}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={authStyles.image}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={[
              authStyles.bottomCard,
              styles.bottomCard,
              {
                opacity: formFadeAnim,
                transform: [{ translateY: formSlideAnim }],
              },
            ]}
          >
            <View style={styles.iconBadge}>
              <Ionicons
                name="mail-outline"
                size={56}
                color={colors.secondaryDark}
              />
            </View>

            <Text style={authStyles.title}>Check your email</Text>
            <Text style={authStyles.subtitle}>
              We&apos;ve sent a password reset email to{" "}
              <Text style={styles.emailText}>{maskEmail(email)}</Text>.
            </Text>

            <TouchableOpacity
              style={authStyles.primaryButton}
              onPress={() => router.replace("/SigninScreen")}
              activeOpacity={0.85}
            >
              <Text style={authStyles.primaryButtonText}>Back to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={16} color={colors.text} />
              <Text style={styles.backLinkText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  imageContainer: {
    flex: 1,
  },
  bottomCard: {
    marginBottom: 0,
  },
  iconBadge: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#FFF7E0",
    borderWidth: 1,
    borderColor: "#F2D38A",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  emailText: {
    color: colors.text,
    fontWeight: "700",
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  backLinkText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default CheckEmailScreen;
