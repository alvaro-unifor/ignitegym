import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKER_STORAGE } from "@storage/storageConfig";

export async function storageAuthTokenSave(token: string) {
    await AsyncStorage.setItem(AUTH_TOKER_STORAGE, token);
}

export async function storageAuthTokenGet() {
    const storage = await AsyncStorage.getItem(AUTH_TOKER_STORAGE);

    return storage;
}

export async function storageAuthTokenRemove() {
    await AsyncStorage.removeItem(AUTH_TOKER_STORAGE);
}