import { useAuthAnimations } from "@/hooks/use-auth-animations";
import { useLogin } from "@/hooks/use-login";
import { useAuth } from "../../contexts/AuthContext";
import { authStyles } from "@/theme";
import { loginSchema } from "@/validations/auth";
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

const SigninScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { signIn } = useAuth();

  const {
    mutate: login,
    isPending,
    error: loginError,
  } = useLogin({
    onSuccess: async (data) => {
      if (data.token && data.user) {
        await signIn(data.token, data.user);
      }
      router.replace("/(home)/HomeScreen");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const { logoFadeAnim, logoScaleAnim, formFadeAnim, formSlideAnim } =
    useAuthAnimations();

  const handleSignIn = () => {
    const payload = {
      email: email.trim(),
      password,
    };
    const validationResult = loginSchema.safeParse(payload);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setValidationErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setValidationErrors({});
    login(validationResult.data);
  };

  useEffect(() => {
    const keyboardShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({
            y: Platform.OS === "ios" ? 48 : 36,
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
              { opacity: logoFadeAnim, transform: [{ scale: logoScaleAnim }] },
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
            <Text style={authStyles.title}>Welcome back</Text>
            <Text style={authStyles.subtitle}>
              Enter your email and password to access your account.
            </Text>

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
                  color="#888"
                  style={authStyles.inputIcon}
                />
                <TextInput
                  placeholder="you@example.com"
                  placeholderTextColor="#999"
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
                  color="#888"
                  style={authStyles.inputIcon}
                />
                <TextInput
                  placeholder="Your password"
                  placeholderTextColor="#999"
                  style={[authStyles.input, authStyles.passwordInput]}
                  secureTextEntry={!showPassword}
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
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              {validationErrors.password ? (
                <Text style={authStyles.errorText}>{validationErrors.password}</Text>
              ) : null}
            </View>

            <View style={authStyles.forgotPasswordContainer}>
              <TouchableOpacity
                onPress={() => router.push("/ForgotPasswordScreen")}
              >
                <Text style={authStyles.forgotPasswordText}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {loginError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{loginError.message}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[authStyles.primaryButton, isPending && { opacity: 0.6 }]}
              onPress={handleSignIn}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={authStyles.primaryButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={authStyles.separator}>
              <View style={authStyles.separatorLine} />
              <Text style={authStyles.separatorText}>or continue with</Text>
              <View style={authStyles.separatorLine} />
            </View>

            <View style={authStyles.socialButtons}>
              <TouchableOpacity style={authStyles.socialButton}>
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text style={authStyles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={authStyles.socialButton}>
                <Ionicons name="logo-apple" size={20} color="#000000" />
                <Text style={authStyles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/SignupScreen")}>
              <Text style={authStyles.footerText}>
                Don&apos;t have an account?{" "}
                <Text style={authStyles.footerLink}>Create account</Text>
              </Text>
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
});

export default SigninScreen;
