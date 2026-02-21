import { useAuthAnimations } from "@/hooks/use-auth-animations";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import { authStyles, colors } from "@/theme";
import { forgotPasswordSchema } from "@/validations/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ForgotPasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
  }>({});

  const { logoFadeAnim, logoScaleAnim, formSlideAnim, formFadeAnim } =
    useAuthAnimations();

  const {
    mutate: sendResetCode,
    isPending,
    error: forgotPasswordError,
  } = useForgotPassword({
    onSuccess: (data) => {
      setSuccessMessage(data.message);
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
    },
  });

  const handleSubmit = () => {
    const payload = {
      email: email.trim(),
    };
    const validationResult = forgotPasswordSchema.safeParse(payload);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setValidationErrors({
        email: fieldErrors.email?.[0],
      });
      return;
    }

    setValidationErrors({});
    setSuccessMessage("");
    sendResetCode(validationResult.data);
  };

  useEffect(() => {
    const keyboardHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        });
      },
    );

    return () => {
      keyboardHideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <KeyboardAvoidingView
        style={authStyles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 24}
      >
        <ScrollView
          ref={scrollViewRef}
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
              {
                opacity: formFadeAnim,
                transform: [{ translateY: formSlideAnim }],
              },
            ]}
          >
            <Text style={authStyles.title}>Reset your password</Text>
            <Text style={styles.helperText}>
              No worries! Enter your email and we&apos;ll send you a code to
              reset it.
            </Text>

            <View style={authStyles.inputWrapper}>
              <Text style={authStyles.label}>Email address</Text>
              <View
                style={[
                  authStyles.inputContainer,
                  validationErrors.email && authStyles.inputError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={colors.textMuted}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textPlaceholder}
                  style={authStyles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(value) => {
                    setEmail(value);
                    if (validationErrors.email) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }));
                    }
                  }}
                  value={email}
                />
              </View>
              {validationErrors.email ? (
                <Text style={authStyles.errorText}>{validationErrors.email}</Text>
              ) : null}
            </View>

            {forgotPasswordError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {forgotPasswordError.message}
                </Text>
              </View>
            )}

            {successMessage ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[authStyles.primaryButton, isPending && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isPending}
              activeOpacity={0.85}
            >
              {isPending ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={authStyles.primaryButtonText}>
                  Send reset link
                </Text>
              )}
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
  helperText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: "#fff5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: "#f0fff4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
  },
  successText: {
    color: "#15803d",
    fontSize: 14,
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

export default ForgotPasswordScreen;
