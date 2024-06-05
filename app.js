// App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuizScreen from './screens/QuizScreen'; // Create this file in the next steps
import ResultsScreen from './screens/ResultsScreen'; // Create this file in the next steps
import SignInScreen from './screens/SignInScreen'; // Create this file in the next steps
import SignUpScreen from './screens/SignUpScreen'; // Create this file in the next steps

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkQuizCompletion = async () => {
      const quizCompleted = await AsyncStorage.getItem('quizCompleted');
      if (quizCompleted) {
        setInitialRoute('SignIn');
      } else {
        setInitialRoute('Quiz');
      }
    };
    checkQuizCompletion();
  }, []);

  if (!initialRoute) {
    return null; // Prevent rendering until the initial route is determined
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
