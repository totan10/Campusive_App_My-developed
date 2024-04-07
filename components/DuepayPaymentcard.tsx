import Colors from '@/constants/Colors';
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface DuePaymentProps {
  month: number; // Month number (0-11)
  amount: number;
  dueDate: string; // YYYY-MM-DD format
  onSelect: (amount: number) => void;
  selected?: boolean; // Optional: indicates if the card is selected
}

const DuepayPaymentcard: React.FC<DuePaymentProps> = ({
  month,
  amount,
  dueDate,
  onSelect,
  selected,
}) => {
  const monthName = new Date(dueDate).toLocaleString('default', { month: 'long' }); // Get month name

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if(new Date(dueDate)<new Date()){
      const fadeAnimation = () => {
    
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000, // Duration for fading in
          useNativeDriver: true,
        }).start(() => {
          // Fade out animation
          Animated.timing(fadeAnim, {
            toValue: 0.6,
            duration: 2000, // Duration for fading out
            useNativeDriver: true,
          }).start(fadeAnimation); // Repeat the animation
        });
      };
      fadeAnimation(); // Start the animation initially
    }
  

  

  // Clean up the animation on unmount
  return () => {
    fadeAnim.setValue(1); // Reset the fade animation value
    fadeAnim.removeAllListeners();
  };
}, [fadeAnim]);


  const handlePress = () => onSelect(amount);

  return (
    <Animated.View style={[
      styles.duePaymentItem,
      { opacity: fadeAnim, elevation: 2 },
      //{ backgroundColor: new Date(dueDate) < new Date() ? 'rgba(255, 0, 0, 0.1)' : '#fff' }
    ]}>
       <View style={styles.duePaymentHeaderContainer}>
        <Text style={styles.duePaymentMonth}>{monthName}</Text>
        <Text style={styles.duePaymentFee}>&#8377;{amount}</Text>
      </View>
      <View style={styles.duePaymentDetails}>
        <Text style={styles.duePaymentText}>Due Date: {dueDate}</Text>
        <TouchableOpacity onPress={handlePress} style={[styles.radioButton, selected && styles.radioButtonSelected]}>
          <View style={styles.radioInnerCircle} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  duePaymentItem: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4, // Add subtle shadow for depth
  },
  duePaymentHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duePaymentMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary, // Use primary color from constants
  },
  duePaymentFee: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  duePaymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  duePaymentText: {
    fontSize: 14,
  },
  radioButton: {
    borderRadius: 50,
    width: 24, // Increased size for better visibility
    height: 24,
    backgroundColor: '#ccc', // Gray background for unselected state
    borderWidth: 2,
    borderColor: '#000', // Black border
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: Colors.primary, // Use primary color for selected state
  },
  radioInnerCircle: {
    width: 12, // Increased size for better visibility
    height: 12,
    borderRadius: 50,
    backgroundColor: '#fff', // White inner circle
  },
});

export default DuepayPaymentcard;
