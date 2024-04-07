import React from "react";
import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "@/constants/Colors";
import { useSelector } from "react-redux";
import { getUser } from "@/redux-store/selectors";
import { FontAwesome } from "@expo/vector-icons"; // You can replace this with the appropriate icon library
import { EXPO_PUBLIC_API_URL } from "@/constants/connection";

interface Fee {
  month: string; // Updated property name
  paymentDate: string;
  amountPaid: number;
}

interface Props {
  data: Fee; // Pass the individual payment data object
  viewReceipt: () => void; // Optional prop for handling receipt view function
}

const PaymentCard = (props: Props) => {
  const { token } = useSelector(getUser);

  const downloadReceipt = () => {
    // Simulated download receipt function
    // You can customize this as needed based on your actual implementation
    ToastAndroid.show("Downloading receipt...", ToastAndroid.SHORT);
  };

  return (
    <Pressable style={styles.container} onPress={props.viewReceipt}>
      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Month</Text>
        <Text>{props.data.month}</Text>
      </View>

      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Payment Date</Text>
        <Text>{props.data.paymentDate}</Text>
      </View>

      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Amount Paid</Text>
        <Text>{props.data.amountPaid}</Text>
      </View>

      <View style={styles.divider} />

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", columnGap: 8 }}>
        {props.viewReceipt && (
          <TouchableOpacity onPress={props.viewReceipt} style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="receipt" size={24} color="black" />
            <Text style={{ marginLeft: 5 }}>View Receipt</Text>
          </TouchableOpacity>
        )}
        <Button title="Download Receipt" onPress={downloadReceipt} />
      </View>
    </Pressable>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
    marginHorizontal: 10,
    rowGap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light,
    marginVertical: 10,
  },
});
