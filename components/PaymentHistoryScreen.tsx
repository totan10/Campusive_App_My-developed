import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import PaymentCard from "./PaymentCard"; // Import the PaymentCard component

// Replace these with your actual data fetching/receiving logic (e.g., API calls)
const dummyPaymentHistoryData = [ // For development/testing purposes only
  { month: "April 2024", paymentDate: "2024-04-01", amountPaid: 120 },
  { month: "April 2024", paymentDate: "2024-04-05", amountPaid: 80 },
  { month: "March 2024", paymentDate: "2024-03-20", amountPaid: 150 },
  { month: "March 2024", paymentDate: "2024-03-15", amountPaid: 200 },
  { month: "March 2024", paymentDate: "2024-03-10", amountPaid: 95 },
];

interface PaymentHistoryProps {
  paymentHistoryData?: { month: string; paymentDate: string; amountPaid: number }[]; // Optional data prop (replace with your actual data structure)
  viewReceipt?: (data: any) => void; // Optional receipt view function prop (if needed)
}

const PaymentHistoryScreen = ({ paymentHistoryData, viewReceipt }: PaymentHistoryProps) => {
  // Use provided data if available, otherwise fallback to dummy data (for development)
  const actualData = paymentHistoryData || dummyPaymentHistoryData;

  return (
    <View style={styles.container}>
      <FlatList
        data={actualData}
        renderItem={({ item }) => (
          <PaymentCard data={item} viewReceipt={viewReceipt} /> // Pass data and optional viewReceipt prop
        )}
        keyExtractor={(item) => item.month} // Extract a unique key for each item
      />
    </View>
  );
};

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allow PaymentHistory to fill available space
    padding: 10,
  },
});
