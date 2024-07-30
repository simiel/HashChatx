import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import TextChat from "@/components/Features/Text";
import Voice from "@/components/Features/Voice";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const getUserData = async () => {
//   const userData = (await AsyncStorage.getItem("userData")) || "";
//   const parsedUserData = userData ? JSON.parse(userData) : {};

//   return parsedUserData;
// };

const text = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const parsedUserData = userData ? JSON.parse(userData) : {};
        console.log("🚀 ~ getUserData ~ parsedUserData:", parsedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error retrieving userData", error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const getOnboardingCompleted = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(
          "onboardingCompleted"
        );
        const userData = await AsyncStorage.getItem("userData");
        console.log(userData);
        if (onboardingCompleted) {
          setIsOnboardingCompleted(true);
        }
      } catch (error) {
        console.error("Error retrieving onboardingCompleted", error);
      }
    };

    getOnboardingCompleted();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {userData?.disability === "hearing" ? <TextChat /> : <Voice />}
    </View>
  );
};

export default text;
