import { useAuthAnimations } from "@/hooks/use-auth-animations";
import { useRegister } from "@/hooks/use-register";
import { authStyles, colors } from "@/theme";
import { registerSchema } from "@/validations/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

const SignupScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});

  const { logoFadeAnim, logoScaleAnim, formFadeAnim, formSlideAnim } =
    useAuthAnimations();

  const {
    mutate: register,
    isPending,
    error: registerError,
  } = useRegister({
    onSuccess: (data) => {
      Alert.alert("Check your email", data.message, [
        { text: "OK", onPress: () => router.replace("/SigninScreen") },
      ]);
    },
    onError: (error) => {
      console.error("Register error:", error);
    },
  });

  const handleSignup = () => {
    const payload = {
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    };
    const validationResult = registerSchema.safeParse(payload);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setValidationErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setValidationErrors({});
    register(validationResult.data);
  };

  useEffect(() => {
    const keyboardShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({
            y: Platform.OS === "ios" ? 56 : 42,
            animated: true,
          });
        });
      },
    );

    const keyboardHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        });
      },
    );

    return () => {
      keyboardShowSubscription.remove();
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
              styles.bottomCard,
              {
                opacity: formFadeAnim,
                transform: [{ translateY: formSlideAnim }],
              },
            ]}
          >
            <Text style={authStyles.title}>Create your account</Text>
            <Text style={authStyles.subtitle}>
              Sign up to start applying and managing your opportunities.
            </Text>

            <View style={authStyles.inputWrapper}>
              <Text style={authStyles.label}>Full name</Text>
              <View
                style={[
                  authStyles.inputContainer,
                  validationErrors.name && authStyles.inputError,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={colors.textMuted}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  placeholder="Your full name"
                  placeholderTextColor={colors.textPlaceholder}
                  style={authStyles.input}
                  autoCapitalize="words"
                  onChangeText={(value) => {
                    setFullName(value);
                    if (validationErrors.name) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        name: undefined,
                      }));
                    }
                  }}
                  value={fullName}
                />
              </View>
              {validationErrors.name ? (
                <Text style={authStyles.errorText}>{validationErrors.name}</Text>
              ) : null}
            </View>

            <View style={authStyles.inputWrapper}>
              <Text style={authStyles.label}>Email</Text>
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

            <View style={authStyles.inputWrapper}>
              <Text style={authStyles.label}>Phone</Text>
              <View
                style={[
                  authStyles.inputContainer,
                  validationErrors.phone && authStyles.inputError,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={colors.textMuted}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  placeholder="Your phone number"
                  placeholderTextColor={colors.textPlaceholder}
                  style={authStyles.input}
                  keyboardType="phone-pad"
                  onChangeText={(value) => {
                    setPhone(value);
                    if (validationErrors.phone) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        phone: undefined,
                      }));
                    }
                  }}
                  value={phone}
                />
              </View>
              {validationErrors.phone ? (
                <Text style={authStyles.errorText}>{validationErrors.phone}</Text>
              ) : null}
            </View>

            <View style={authStyles.inputWrapper}>
              <Text style={authStyles.label}>Password</Text>
              <View
                style={[
                  authStyles.inputContainer,
                  validationErrors.password && authStyles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.textMuted}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor={colors.textPlaceholder}
                  style={[authStyles.input, authStyles.passwordInput]}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onChangeText={(value) => {
                    setPassword(value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  value={password}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={authStyles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {validationErrors.password ? (
                <Text style={authStyles.errorText}>
                  {validationErrors.password}
                </Text>
              ) : null}
            </View>

            {registerError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{registerError.message}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[authStyles.primaryButton, isPending && { opacity: 0.6 }]}
              onPress={handleSignup}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={authStyles.primaryButtonText}>Sign Up</Text>
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
    paddingBottom: 12,
  },
  imageContainer: {
    minHeight: 120,
    marginBottom: 12,
  },
  bottomCard: {
    marginBottom: 0,
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
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  backLinkText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default SignupScreen;
