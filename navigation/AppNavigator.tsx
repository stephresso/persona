import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from '../screens/WelcomeScreen';
import CareersScreen from '../screens/CareersScreen';
import YouScreen from '../screens/YouScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultsScreen from '../screens/ResultsScreen';
import CareerDetailsScreen from '../screens/CareerDetailsScreen';
import ShiftScreen from '../screens/ShiftScreen';
import GlassTabBar from '../components/GlassTabBar';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <GlassTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
      },
    }}>
    <Tab.Screen name="Home" component={WelcomeScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="Careers" component={CareersScreen} options={{ title: 'Careers' }} />
    <Tab.Screen name="You" component={YouScreen} options={{ title: 'You' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen
          name="CareerDetails"
          component={CareerDetailsScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: COLORS.ink,
            headerStyle: { backgroundColor: 'transparent' },
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Shift"
          component={ShiftScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: COLORS.ink,
            headerStyle: { backgroundColor: 'transparent' },
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
