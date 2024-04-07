import {
  Alert,
  Button,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { downloadAssignment } from "@/constants/endpoints";
import RNFetchBlob from "rn-fetch-blob";
import { useSelector } from "react-redux";
import { getUser } from "@/redux-store/selectors";
import { Entypo } from "@expo/vector-icons";
import { EXPO_PUBLIC_API_URL } from "@/constants/connection";

interface Props {
  fileLink: string;
  groups: string;
  createdBy: string;
  createdOn: string;
  notificationId: string;
  notificationType: string;
  notificationBody: string;
  notificationTitle:string;
  isVisited: boolean; // New prop for visited state
}

const NotificationCard = (props: Props) => {
  const { token } = useSelector(getUser);

  const download = () => {
    const url = `${EXPO_PUBLIC_API_URL}${downloadAssignment(
      props.fileLink
    )}`;
    ToastAndroid.show("Download started", ToastAndroid.SHORT);
    RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true, // <-- this is the only thing required
        // Optional, override notification setting (default to true)
        notification: true,
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${props.assignmentFile}.pdf`,
        // Optional, but recommended since android DownloadManager will fail when
        // the url does not contains a file extension, by default the mime type will be text/plain
        mime: "application/pdf",
        mediaScannable: true,
        description: "File downloaded by download manager.",
      },
    })
      .fetch("GET", url, {
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        ToastAndroid.show("Download complete", ToastAndroid.SHORT);
      })
      .catch((error) => {
        ToastAndroid.show("Download failed", ToastAndroid.SHORT);
      });
  };

  return (
    <Pressable style={[styles.container, {backgroundColor: props.isVisited ? Colors.fadedColor : Colors.white}]}>
      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Notification Title</Text>
        <Text>{props.notificationTitle}</Text>
      </View>

      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Notification Date</Text>
        <Text>{props.createdOn}</Text>
      </View>

      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Created By</Text>
        <Text>{props.createdBy}</Text>
      </View>

      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Notification Type</Text>
        <Text
          style={{
            color: props.notificationType === "Sent" ? Colors.secondary : Colors.black,
            fontWeight: "500",
          }}
        >
          {props.notificationType}
        </Text>
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
        {props?.notificationBody && (
          <TouchableOpacity
            style={
              {
                // alignItems: 'flex-end'
              }
            }
            onPress={() => {
              Alert.alert(
                "Description",
                `${props?.notificationBody || "No description found"}`
              );
            }}
          >
            <Entypo name="eye" size={24} color="black" />
          </TouchableOpacity>
        )}
        {props.fileLink && <Button title="Download" onPress={download} />}
      </View>
    </Pressable>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  container: {
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
