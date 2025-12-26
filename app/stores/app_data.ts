import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const useAppData = defineStore("appData", {
  state: () => ({
    fullName: "",
  }),
  actions: {
    setFullName(fullName: string) {
      this.fullName = fullName;
    },
  },
  persist: {
    storage: {
      // MUST use new SecureLS() for each getItem and setItem
      getItem: (key: string) => {
        return new SecureLS({
          isCompression: false,
          encodingType: "aes",
          encryptionSecret: "encryptionSecret",
        }).get(key);
      },
      setItem: (key: string, value: string) => {
        return new SecureLS({
          isCompression: false,
          encodingType: "aes",
          encryptionSecret: "encryptionSecret",
        }).set(key, value);
      },
    },
  },
});
