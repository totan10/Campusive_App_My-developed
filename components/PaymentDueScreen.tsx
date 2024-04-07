import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import DuepayPaymentcard from './DuepayPaymentcard'; // Import the component
import Colors from '@/constants/Colors';

const PaymentDueScreen = () => {
  const [selectedFee, setSelectedFee] = useState(null); // Keeps track of selected fee
  const [buttonPressAnimation] = useState(new Animated.Value(1)); // Animation value

  const feeData = [
    { amount: 1000, dueDate: '2024-03-10' },
    { amount: 500, dueDate: '2024-04-15' },
    { amount: 2000, dueDate: '2024-05-01' },
  ];

  const handleSelectFee = (amount) => {
    setSelectedFee(amount); // Update selected fee on selection
  };

  const onPressButton = () => {
    // Start button press animation
    Animated.sequence([
      Animated.timing(buttonPressAnimation, {
        toValue: 0.8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPressAnimation, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Your action on button press
      alert(`Proceed to pay ₹${selectedFee}`); // Changed alert message
    });
  };

  const buttonLabel = selectedFee ? `Proceed to pay ₹${selectedFee}` : 'Proceed to pay'; // Dynamically set button label

  const alternateColors = [Colors.light, Colors.primary]; // Adjust colors as needed
  return (
    <View style={styles.container}>
      <FlatList
        data={feeData.filter((item) => !item.paid)} // Filter due payments
        renderItem={({ item }) => (
          <DuepayPaymentcard
            {...item}
            month={new Date(item.dueDate).getMonth()} // Extract month for header
            onSelect={handleSelectFee}
            selected={item.amount === selectedFee} // Pass selection state
          />
        )}
        keyExtractor={(item) => item.amount.toString()} // Ensure key is a string
      />
      <TouchableOpacity onPress={onPressButton} activeOpacity={0.6}>
        <Animated.View
          style={[
            styles.button,
            {
              transform: [{ scale: buttonPressAnimation }],
            },
          ]}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </Animated.View>
      </TouchableOpacity>
      {selectedFee && ( // Display selected fee amount if any
        <Text style={styles.selectedFee}>Selected Fee: ₹{selectedFee}</Text>
      )}
    </View>
  );
};

export default PaymentDueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Background color for entire screen
  },
  button: {
    backgroundColor: Colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',

    marginBottom:30
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedFee: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10, // Adjust margin as needed
  },
});
