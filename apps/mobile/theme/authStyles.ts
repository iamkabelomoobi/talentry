import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const authStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    paddingTop: 24,
    paddingBottom: 36,
  },

  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 150,
    marginBottom: 20,
  },

  image: {
    width: 300,
    height: 200,
  },

  bottomCard: {
    backgroundColor: colors.backgroundLight,
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  subHeading: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },

  inputWrapper: {
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 0,
  },

  halfInputWrapper: {
    flex: 1,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  inputError: {
    borderColor: colors.borderError,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 14,
  },

  passwordInput: {
    paddingRight: 40,
  },

  eyeIcon: {
    padding: 8,
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },

  primaryButton: {
    backgroundColor: colors.black,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  primaryButtonText: {
    textAlign: "center",
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  secondaryButton: {
    backgroundColor: colors.buttonSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: 12,
  },

  secondaryButtonText: {
    textAlign: "center",
    color: colors.buttonTextSecondary,
    fontWeight: "600",
    fontSize: 16,
  },

  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.separator,
  },

  separatorText: {
    color: colors.textMuted,
    paddingHorizontal: 16,
    fontSize: 13,
  },

  socialButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },

  socialButtonText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },

  footerText: {
    textAlign: "center",
    color: colors.textLight,
    fontSize: 14,
  },

  footerLink: {
    color: colors.black,
    fontWeight: "600",
  },

  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },

  forgotPasswordText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
});
