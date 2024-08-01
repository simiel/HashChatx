import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OpenAI from "openai";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import axios from "axios";

const openai = new OpenAI({
  apiKey: "sk-proj-1QeKnew1Z6MY3CazY3xNT3BlbkFJsP1dGVemeeQpvGRsnBMf",
});

const clearData = async () => {
  try {
    await AsyncStorage.removeItem("messages");
    await AsyncStorage.removeItem("onboardingCompleted");
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("Error clearing messages", error);
  }
};

const getUserData = async () => {
  const userData = (await AsyncStorage.getItem("userData")) || "";
  const parsedUserData = userData ? JSON.parse(userData) : {};
  let userString = "";
  if (parsedUserData.gender) {
    userString += `Gender: ${parsedUserData.gender}\n`;
  }
  if (parsedUserData.age) {
    userString += `Age: ${parsedUserData.age}\n`;
  }
  if (parsedUserData.disability) {
    userString += `Disability: ${parsedUserData.disability}\n`;
  }

  console.log("🚀 ~ getUserData ~ userString:", userString);

  return userString;
};

const RECORDING_OPTIONS = {
  android: {
    extension: ".m4a",
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".m4a",
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

const fetchAudioResponse = async (audioUri: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", {
    uri: audioUri,
    name: "recording.m4a",
    type: "audio/m4a",
  } as any);

  const response = await axios.post(
    "https://api.openai.com/v1/whisper",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
    }
  );
  return response.data.text;
};

const VoiceToText: React.FC = () => {
  const router = useRouter();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState<
    number | null
  >(null);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const initialContextMessage = {
    role: "user",
    content: "You are an AI chatbot for mental health.",
  };

  const getSavedResponses = async () => {
    try {
      const savedResponses = await AsyncStorage.getItem("conversationHistory");
      const parsedResponses: string[] = savedResponses
        ? JSON.parse(savedResponses)
        : [];
      setConversationHistory(parsedResponses);
    } catch (error) {
      console.error("Error retrieving responses", error);
    }
  };

  const previousResponse = () => {
    if (currentResponseIndex !== null && currentResponseIndex > 0) {
      const newIndex = currentResponseIndex - 1;
      setCurrentResponseIndex(newIndex);
      // speakResponse(responses[newIndex]);
    }
  };

  const nextResponse = () => {
    if (
      currentResponseIndex !== null &&
      currentResponseIndex < responses.length - 1
    ) {
      const newIndex = currentResponseIndex + 1;
      setCurrentResponseIndex(newIndex);
      // speakResponse(responses[newIndex]);
    }
  };

  const animateButton = (toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();

      console.log("Setting audio mode..");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording
        .createAsync
        // Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        ();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      console.log("Stopping recording..");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);

      try {
        const formData = new FormData();
        formData.append("audio", {
          uri: uri,
          name: "recording.m4a",
          type: "audio/m4a",
        } as unknown as Blob);

        const response = await axios.post(
          "https://speechserver.onrender.com/audio",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("🚀 ~ stopRecording ~ response:", response);

        // Play the received audio
        // if (audioUri) {
        //   const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        //   setSound(sound);
        //   await sound.playAsync();
        // }
      } catch (error) {
        console.error("Error processing audio", error);
      } finally {
        setRecording(null);
      }
    }
  };

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const onboardingStatus = await AsyncStorage.getItem(
        "onboardingCompleted"
      );
      if (!onboardingStatus) {
        router.replace("/onboarding");
      }
    };

    checkOnboardingStatus();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={() => {
          animateButton(1.5);
          startRecording();
        }}
        onPressOut={() => {
          animateButton(1);
          stopRecording();
        }}
        style={styles.recordButton}
      >
        <Animated.View
          style={[
            styles.animatedButton,
            { transform: [{ scale: animatedValue }] },
          ]}
        >
          <Text style={styles.recordButtonText}>🎤</Text>
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.navigationButtons}>
        <Button
          title="Previous"
          onPress={previousResponse}
          disabled={currentResponseIndex === 0}
        />
        <Button
          title="Next"
          onPress={nextResponse}
          disabled={
            currentResponseIndex === null ||
            currentResponseIndex === responses.length - 1
          }
        />
      </View>
      {results.length > 0 && (
        <View style={{ marginTop: 20 }}>
          {results.map((result, index) => (
            <Text key={index}>{result}</Text>
          ))}
        </View>
      )}
      {responses.length > 0 && (
        <View style={{ marginTop: 20 }}>
          {responses.map((response, index) => (
            <Text key={index}>{response}</Text>
          ))}
        </View>
      )}
      <Button title="Sign Out & Clear Data" onPress={clearData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  recordButton: {
    marginBottom: 20,
  },
  animatedButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f00",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonText: {
    fontSize: 40,
    color: "#fff",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
});

export default VoiceToText;
