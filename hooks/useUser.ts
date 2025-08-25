import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUser = async () => {
    try {
        const value = await AsyncStorage.getItem('user_id');
        if (value !== null) {
            const user = JSON.parse(value) as string
            return user
        } else {
            return null
        }
    } catch (e) {
        return null
    }
};