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

interface Props {
  class: string;
  paymentDate: string;
  amountPaid: number;
  viewReceipt: () => void;
}

const FeeCard = (props: Props) => {
  const { token } = useSelector(getUser);

  const downloadReceipt = () => {
    // Simulated download receipt function
    // You can customize this as needed based on your actual implementation
    ToastAndroid.show("Downloading receipt...", ToastAndroid.SHORT);
  };

  return (
    <Pressable style={styles.container}>
      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Class</Text>
        <Text>{props.class}</Text>
      </View>

      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Payment Date</Text>
        <Text>{props.paymentDate}</Text>
      </View>

      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Amount Paid</Text>
        <Text>{props.amountPaid}</Text>
      </View>

      <View style={styles.divider} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 8,
        }}
      >
        <TouchableOpacity
          onPress={props.viewReceipt}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <FontAwesome name="receipt" size={24} color="black" />
          <Text style={{ marginLeft: 5 }}>View Receipt</Text>
        </TouchableOpacity>
        <Button title="Download Receipt" onPress={downloadReceipt} />
      </View>
    </Pressable>
  );
};

export default FeeCard;

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
