import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import React, { useEffect, useState } from "react";
import {
  getIsLoadingNotifications,
  getProfile,
  getUser,
} from "@/redux-store/selectors";
import { useSelector } from "react-redux";
import { EXPO_PUBLIC_API_URL, instance } from "@/constants/connection";
import Colors from "@/constants/Colors";
import RNFetchBlob from "rn-fetch-blob";
import { downloadAssignment } from "@/constants/endpoints";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import SelectMultiple from 'react-native-select-multiple';
import Footer from "@/components/footer";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const notification = () => {
  const { token } = useSelector(getUser);
  const profile = useSelector(getProfile);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState([]);
  const [classes, setClasses] = useState();
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [notificationType, setNotificationType] = useState();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [file, setFile] = useState();
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingSubmitting, setLoadingSubmitting] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const getNotifications = async () => {
    try {
      setLoading(true);
      const res = await instance.get(
        `/academic/notification/class/assignment/${profile?.userCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const getClasses = async () => {
    try {
      const res = await instance.get("/academic/institute/class/subscriber", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setClasses(
        data.map((item) => ({
          value: item.instituteClassId,
          label: item.instituteClassName,
        }))
      );
    } catch (error) {
      console.log(error);

      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    if (profile) {
      getNotifications();
    }
    getClasses();
  }, []);
 

  const uploadImageFile = async (file) => {
    try {
      setLoadingImage(true);
      const fd = new FormData();
      fd.append("files", {
        uri: file.uri,
        name: "" + new Date().getMilliseconds(),
        type: file.mimeType,
      });
      const res = await instance.postForm("/master/file//upload/OTHER", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      const { fileId } = data[0];
      setFile(fileId);
      setLoadingImage(false);
    } catch (error) {
      setLoadingImage(false);
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  const download = (assignmentFile) => {
    const url = `${EXPO_PUBLIC_API_URL}${downloadAssignment(assignmentFile)}`;
    ToastAndroid.show("Download started", ToastAndroid.SHORT);
    RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true, // <-- this is the only thing required
        // Optional, override notification setting (default to true)
        notification: true,
        // Optional, but recommended since android DownloadManager will fail when
        // the url does not contains a file extension, by default the mime type will be text/plain
        mime: "application/pdf",
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${assignmentFile}.pdf`,
        description: "File downloaded by download manager.",
        mediaScannable: true,
      },
    })
      .fetch("GET", url, {
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        ToastAndroid.show("Download complete", ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const delete_notification = async (item) => {
    try {
      console.log(item);
      
      const res = await instance.get(
        `/academic/notification/delete/${item?.notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      ToastAndroid.show(
        res.data || "Notification successfully deleted",
        ToastAndroid.SHORT
      );
      await getNotifications();
    } catch (error) {
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };
  const onClassChange =(selectedClass)=>{
    console.log(selectedClass);
    
    setSelectedClass(selectedClass);
  }
  const handleSelect = (value) => {
    const newSelectedValues = [...selectedClass]; // Copy to avoid mutation

    // Check if the value is already selected
    const isSelected = newSelectedValues.includes(value);

    if (isSelected) {
      // Remove if already selected
      const index = newSelectedValues.indexOf(value);
      newSelectedValues.splice(index, 1);
    } else {
      // Add if not already selected
      newSelectedValues.push(value);
    }

    setSelectedClass(newSelectedValues);
  };
  const submit = async () => {
    if (selectedClass && notificationTitle) {
      const values = selectedClass.map(item => item.value);
      console.log(values);
      
      const body = {
        createdBy:profile.userCode,
        notificationTitle: notificationTitle,
        fileLink: file,
        notificationType: notificationType,
        notificationBody: notificationBody,
        groupId: values,
      };
      console.log(body);
      
      try {
        setLoadingSubmitting(true);
        const res = await instance.post("/academic/notification/", body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        ToastAndroid.show(
          "Notification created successfully",
          ToastAndroid.SHORT
        );
        setFile();
        setNotificationTitle("");
        setNotificationBody("");
        setDate(new Date());
        setSelectedClass();
        setNotificationType("");
        setModal(false);
        setLoadingSubmitting(false);
        await getNotifications();
      } catch (error) {
        setLoadingSubmitting(false);
        ToastAndroid.show(error)
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
    }
  };

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notifications
            ?.map((item) => item)
            .sort((a, b) => new Date(b?.createdOn) - new Date(a?.createdOn))}
          refreshing={loading}
          onRefresh={async () => {
            await getNotifications();
            await getClasses();
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Notification Title</Text>
                  <Text>{item?.notificationTitle}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Classes</Text>
                  <Text>{item?.groups}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Created On</Text>
                  <Text>{moment(item?.createdOn).format("DD-MM-YYYY")}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Created On</Text>
                  <Text>{item?.notificationType}</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    columnGap: 8,
                  }}
                >
                  {item?.notificationBody ? (
                    <TouchableOpacity
                      style={
                        {
                          // alignItems: 'flex-end'
                        }
                      }
                      onPress={() => {
                        Alert.alert(
                          "Description",
                          `${item?.notificationBody || "No description found"}`
                        );
                      }}
                    >
                      <Entypo name="eye" size={24} color="black" />
                    </TouchableOpacity>
                  ) : (
                    <View></View>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 8,
                    }}
                  >
                    {item?.fileLink && (
                      <Button
                        title="Download"
                        onPress={async () => {
                          download(item?.fileLink);
                        }}
                      />
                    )}

                    <Button
                      title="Delete"
                      color={Colors.red}
                      onPress={async () => {
                        await delete_notification(item);
                      }}
                    />
                  </View>
                </View>
              </View>
            );
          }}
          // ListFooterComponent={<Footer />}
        />
      )}

      <Footer />

      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => setModal(true)}
      >
        <AntDesign
          name="plus"
          style={{ fontWeight: "bold" }}
          size={32}
          color={Colors.white}
        />
      </TouchableOpacity>

      <Modal
        visible={modal}
        onRequestClose={() => setModal(false)}
        transparent
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 4,
              padding: 8,
              elevation: 4,
              width: "80%",
            }}
          >
            <View style={[styles.row, { marginBottom: 8 }]}>
              <Text
                style={{ textAlign: "center", fontSize: 16, fontWeight: "500" }}
              >
                Create Notification
              </Text>
              <AntDesign
                name="close"
                size={24}
                color="black"
                onPress={() => setModal(false)}
              />
            </View>

            <View style={styles.card}>
              <TextInput
                placeholder="Notification Title *"
                value={notificationTitle}
                onChangeText={setNotificationTitle}
              />
            </View>
            <View style={styles.card}>
              <TextInput
                placeholder="Notification Type *"
                value={notificationType}
                onChangeText={setNotificationType}
              />
            </View>
            {classes && (
              <View style={styles.card}>
                <Text>Class *</Text>
                <SelectMultiple
                items={classes}
                selectedItems={selectedClass}
                onSelectionsChange={onClassChange}
                />
                
              </View>
            )}

            <View style={styles.card}>
              <TextInput
                placeholder="Notification Body (optional)"
                numberOfLines={1}
                multiline
                style={{
                  maxHeight: 100,
                  textAlignVertical: "center",
                }}
                scrollEnabled
                value={notificationBody}
                onChangeText={setNotificationBody}
              />
            </View>

            <TouchableOpacity
              style={styles.card}
              onPress={async () => {
                let result = await DocumentPicker.getDocumentAsync({
                  type: "application/pdf",
                  multiple: false,
                  copyToCacheDirectory: true,
                });
                if (!result.canceled) {
                  const data = result.assets[0];
                  await uploadImageFile(data);
                }
              }}
            >
              <View style={styles.row}>
                <Text>Upload File</Text>
                <Entypo name="upload-to-cloud" size={24} color={Colors.gray} />
              </View>
            </TouchableOpacity>

            {file && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 8,
                  flexDirection: "row",
                  columnGap: 8,
                }}
              >
                <AntDesign name="pdffile1" size={24} color={Colors.red} />
                <Text style={{ fontSize: 12 }}>{file}</Text>
              </View>
            )}

            {loadingImage && (
              <View style={styles.card}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            )}

            <View style={styles.card}>
              {loadingSubmitting ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : (
                <Button
                  title="Submit"
                  onPress={submit}
                  color={Colors.secondary}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.white,
    elevation: 4,
    borderRadius: 4,
    padding: 8,
    columnGap: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    margin: 6,
    rowGap: 12,
  },
  floatingBtn: {
    position: "absolute",
    bottom: 28,
    right: 16,
    backgroundColor: Colors.danger,
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
