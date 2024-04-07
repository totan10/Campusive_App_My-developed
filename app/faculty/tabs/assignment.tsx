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
import React, { useEffect, useState } from "react";
import {
  getIsLoadingAssignments,
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
import Footer from "@/components/footer";

const Assignment = () => {
  const { token } = useSelector(getUser);
  const profile = useSelector(getProfile);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState();
  const [classes, setClasses] = useState([]);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [file, setFile] = useState();
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingSubmitting, setLoadingSubmitting] = useState(false);

  const getAssignments = async () => {
    try {
      setLoading(true);
      const res = await instance.get(
        `/academic/institute/class/attendance/class/assignment/${profile?.memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      setAssignments(data);
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
      setClasses(data);
    } catch (error) {
      console.log(error);

      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    if (profile) {
      getAssignments();
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

  // const pickImage = async (type: string) => {
  //   if (type === 'gallery') {
  //     // No permissions request is necessary for launching the image library
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: .2,
  //     });

  //     console.log(result);

  //     if (!result.canceled) {
  //       await uploadImage(result.assets[0])
  //       // setImage(result.assets[0]);
  //     }
  //   }
  //   else {
  //     // No permissions request is necessary for launching the image library
  //     let result = await ImagePicker.launchCameraAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: .2,
  //     });

  //     console.log(result);

  //     if (!result.canceled) {
  //       await uploadImage(result.assets[0])
  //       // setImage(result.assets[0]);
  //     }
  //   }
  // };

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

  const delete_assignment = async (item) => {
    try {
      const res = await instance.delete(
        `/academic/institute/class/attendance/delete/assignment/id/${item?.assignmentIdentifingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      ToastAndroid.show(
        res.data || "institute Class Period Assignment  successfully deleted",
        ToastAndroid.SHORT
      );
      await getAssignments();
    } catch (error) {
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  // const pickImage = async () => {
  //   Alert.alert("", "Select source", [
  //     {
  //       text: "Camera",
  //       async onPress(value) {
  //         let result = await ImagePicker.launchCameraAsync({
  //           mediaTypes: ImagePicker.MediaTypeOptions.All,
  //           allowsEditing: true,
  //           aspect: [4, 3],
  //           quality: .2,
  //         });
  //         if (!result.canceled) {
  //           const data = result.assets[0];
  //           await uploadImageFile(data)
  //         }
  //       },
  //     },
  //     {
  //       text: "Gallery",
  //       async onPress(value) {
  //         let result = await ImagePicker.launchImageLibraryAsync({
  //           mediaTypes: ImagePicker.MediaTypeOptions.All,
  //           allowsEditing: true,
  //           aspect: [4, 3],
  //           quality: .2,
  //         });
  //         if (!result.canceled) {
  //           const data = result.assets[0];
  //           await uploadImageFile(data)
  //         }
  //       },
  //     },
  //     {
  //       text: "Document",
  //       async onPress(value) {
  //         let result = await DocumentPicker.getDocumentAsync({
  //           type: 'application/pdf',
  //           multiple: false,
  //           copyToCacheDirectory: true
  //         })
  //         if (!result.canceled) {
  //           const data = result.assets[0];
  //           await uploadImageFile(data)
  //         }
  //       },
  //     },
  //     {
  //       text: "Cancel",
  //       style: 'cancel'
  //     }
  //   ], { cancelable: true })
  // }

  const submit = async () => {
    if (selectedClass && assignmentName) {
      const body = {
        assignmentDate: moment(date).format("DD-MM-YYYY"),
        assignmentFile: file,
        assignmentName: assignmentName,
        assignmentDescription,
        instituteClassId: selectedClass,
      };

      try {
        setLoadingSubmitting(true);
        const res = await instance.post(
          "/academic/institute/class/attendance/add/student/user/assignment/",
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        ToastAndroid.show(
          "Assignment submitted successfully",
          ToastAndroid.SHORT
        );
        setFile();
        setAssignmentName("");
        setAssignmentDescription("");
        setDate(new Date());
        setSelectedClass();
        setModal(false);
        setLoadingSubmitting(false);
        await getAssignments();
      } catch (error) {
        setLoadingSubmitting(false);
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
          data={assignments
            ?.map((item) => item)
            .sort(
              (a, b) =>
                new Date(b?.attendanceDate) - new Date(a?.attendanceDate)
            )}
          refreshing={loading}
          onRefresh={async () => {
            await getAssignments();
            await getClasses();
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Assignment Name</Text>
                  <Text>{item?.assignmentName}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Class Name</Text>
                  <Text>{item?.className}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Created On</Text>
                  <Text>{moment(item?.createdOn).format("DD-MM-YYYY")}</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    columnGap: 8,
                  }}
                >
                  {item?.assignmentDescription ? (
                    <TouchableOpacity
                      style={
                        {
                          // alignItems: 'flex-end'
                        }
                      }
                      onPress={() => {
                        Alert.alert(
                          "Description",
                          `${
                            item?.assignmentDescription ||
                            "No description found"
                          }`
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
                    {item?.fileId && (
                      <Button
                        title="Download"
                        onPress={async () => {
                          download(item?.fileId);
                        }}
                      />
                    )}

                    <Button
                      title="Delete"
                      color={Colors.red}
                      onPress={async () => {
                        await delete_assignment(item);
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
                Create Assignment
              </Text>
              <AntDesign
                name="close"
                size={24}
                color="black"
                onPress={() => setModal(false)}
              />
            </View>

            <View style={styles.card}>
              <Text>Institute Class *</Text>
              <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedClass(itemValue)
                }
                mode="dropdown"
                placeholder="Institute Class *"
              >
                {classes?.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item?.instituteClassName}
                      value={item?.instituteClassId}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </View>

            <View style={styles.card}>
              <TextInput
                placeholder="Assignment Name *"
                value={assignmentName}
                onChangeText={setAssignmentName}
              />
            </View>

            <View style={styles.card}>
              <TextInput
                placeholder="Assignment Description (optional)"
                numberOfLines={1}
                multiline
                style={{
                  maxHeight: 100,
                  textAlignVertical: "center",
                }}
                scrollEnabled
                value={assignmentDescription}
                onChangeText={setAssignmentDescription}
              />
            </View>

            <View style={styles.card}>
              <Text>Date *</Text>

              <TouchableOpacity onPress={() => setShow(true)}>
                <Text>
                  {date?.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Text>

                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={"datetime"}
                    is24Hour={true}
                    onChange={onChange}
                  />
                )}
              </TouchableOpacity>
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
                <Text>Upload*</Text>
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
                  color={Colors.primary}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Assignment;

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
