import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OpenAI from "openai";
import { useRouter } from "expo-router";

const openai = new OpenAI({
  apiKey: "sk-proj-1QeKnew1Z6MY3CazY3xNT3BlbkFJsP1dGVemeeQpvGRsnBMf",
});

const CONTEXT_MESSAGE = {
  role: "system",
  content:
    "You are an expert in Ghanaian Adolescent Sexual and Reproductive Health issues. You provide safe, concise, precise, relevant and age-appropriate information to Ghanaian adolescents who are visually or hearing impaired.",
};

interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}

const TextChat: React.FC = () => {
  let userString = "";
  const router = useRouter();
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

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

  useEffect(() => {
    initializeMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeMessages = async () => {
    const savedMessages = await AsyncStorage.getItem("messages");
    let parsedMessages: Message[] = savedMessages
      ? JSON.parse(savedMessages)
      : [];
    if (parsedMessages.length === 0) {
      const userData = await getUserData();
      const initialMessages = [
        CONTEXT_MESSAGE,
        { role: "user", content: userData },
      ];
      setMessages(initialMessages as Message[]);
      await saveMessages(initialMessages as Message[]);
    } else {
      setMessages(parsedMessages);
    }
  };

  const getUserData = async () => {
    const userData = (await AsyncStorage.getItem("userData")) || "";
    const parsedUserData = userData ? JSON.parse(userData) : {};
    userString = "";
    if (parsedUserData.gender) {
      userString += `Gender: ${parsedUserData.gender}\n`;
    }
    if (parsedUserData.age) {
      userString += `Age: ${parsedUserData.age}\n`;
    }
    if (parsedUserData.disability) {
      userString += `Disability: ${parsedUserData.disability}\n`;
    }
    return userString;
  };

  const saveMessages = async (messages: Message[]) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages", error);
    }
  };

  const sendMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    await saveMessages(updatedMessages);
    await sendToChatGPT(updatedMessages);
  };

  const sendToChatGPT = async (contextMessages: Message[]) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: contextMessages,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.choices[0].message.content || "",
      };
      const updatedMessages = [...contextMessages, assistantMessage];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
    } catch (error) {
      console.error("Error sending message to ChatGPT", error);
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      await AsyncStorage.removeItem("onboardingCompleted");
      setMessages([CONTEXT_MESSAGE] as Message[]);
    } catch (error) {
      console.error("Error clearing messages", error);
    }
  };

  const filteredMessages = messages.filter(
    (message) => message.role !== "system" && message.content !== userString
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        renderItem={({ item }) => (
          <View
            style={
              item.role === "user"
                ? styles.userMessage
                : styles.assistantMessage
            }
          >
            <Text>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
        />
        <Button
          title="Send"
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
        />
      </View>
      <Button title="Sign Out & Clear Data" onPress={clearData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#EAEAEA",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
});

export default TextChat;
