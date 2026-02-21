import * as SecureStore from "expo-secure-store";

const SESSION_TOKEN_KEY = "better-auth.session_token";

export const secureStorage = {
  saveSessionToken: async (token: string) => {
    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
  },

  getSessionToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  },

  deleteSessionToken: async () => {
    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
  },
};
