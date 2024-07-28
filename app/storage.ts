import AsyncStorage from "@react-native-async-storage/async-storage";

const saveData = async (token: string,name:string,usd:number,sc:number,transaction:any) => {
  try {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("name", name);
    await AsyncStorage.setItem("usd", usd.toString());
    await AsyncStorage.setItem("sc", sc.toString());
    await AsyncStorage.setItem("transaction", JSON.stringify(transaction));
  } catch (error) {
    console.log("Error saving token:", error);
  }
};

const getData = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const usd=await AsyncStorage.getItem("usd");
    const transaction=await AsyncStorage.getItem("transaction");
    const name=await AsyncStorage.getItem("name");
    return JSON.stringify({name:name, token:token,usd:usd,transaction:transaction });
  } catch (error) {
    console.log("Error getting token:", error);
  }
};

const removeData = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("usd");
    await AsyncStorage.removeItem("transaction");
    await AsyncStorage.removeItem("name");
    await AsyncStorage.removeItem("sc");
  } catch (error) {
    console.log("Error removing token:", error);
  }
};

export { saveData, getData, removeData };
