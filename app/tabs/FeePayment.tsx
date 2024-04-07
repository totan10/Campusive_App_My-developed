import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'; // Import FontAwesome5 for icons

import PaymentHistoryScreen from '@/components/PaymentHistoryScreen';
import PaymentDueScreen from '@/components/PaymentDueScreen';

const Tab = createBottomTabNavigator();

const FeePayment = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Payment Due') {
            iconName = focused ? 'calendar-due' : 'calendar-alt'; // Descriptive icons
          } else if (route.name === 'Payment History') {
            iconName = focused ? 'receipt' : 'money-bill'; // Descriptive icons
          } else {
            // Handle unexpected route names (optional)
            iconName = 'question';
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue', // Set active tab color
        tabBarInactiveTintColor: 'gray', // Set inactive tab color
      })}
    >
      <Tab.Screen name="Payment Due" component={PaymentDueScreen} />
      <Tab.Screen name="Payment History" component={PaymentHistoryScreen}>
        {/* Pass fee data as props if needed */}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default FeePayment;
