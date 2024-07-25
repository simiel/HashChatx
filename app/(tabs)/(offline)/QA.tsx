// screens/QuestionsScreen.js
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
// import data from '../../../../assets/fulldata.json';

interface dataType {
  TOPIC: string;
  SUBTOPIC: string;
  questions_text: string;
  Answers: string;
}

const data: dataType[] = require('../../../assets/fulldata.json');

export default function QuestionsScreen() {
  const { topic, subtopic } = useLocalSearchParams();
  const questions = data.filter(
    (item) => item.TOPIC === topic && item.SUBTOPIC === subtopic
  );
  const [collapsed, setCollapsed] = useState(questions.map(() => true));

  const toggleExpanded = (index: number) => {
    setCollapsed(collapsed.map((item, idx) => (idx === index ? !item : item)));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{subtopic}</Text>
      {questions.map((q, index) => (
        <View key={index} style={styles.questionContainer}>
          <TouchableOpacity
            onPress={() => toggleExpanded(index)}
            style={styles.questionButton}
          >
            <Text style={styles.questionText}>{q.questions_text}</Text>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[index]}>
            <Text style={styles.answerText}>{q.Answers}</Text>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  questionButton: {
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 5,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  answerText: {
    padding: 10,
    fontSize: 16,
    color: '#333333',
  },
});
