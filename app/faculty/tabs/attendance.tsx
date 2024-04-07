import {
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUser } from "@/redux-store/selectors";
import { instance } from "@/constants/connection";
import Colors from "@/constants/Colors";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Footer from "@/components/footer";

const Attendance = () => {
  const { token } = useSelector(getUser);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState();
  const [date, setDate] = useState(new Date());
  const [clasAttendanceStatusId, setClasAttendanceStatusId] = useState();
  const [status, setStatus] = useState();
  const [mapping, setMapping] = useState([]);

  const [attendances, setAttendances] = useState([]);
  const [isLoadingAttn, setIsLoadingAttn] = useState(false);

  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const getAttendance = async () => {
    try {
      setLoading(true);
      const res = await instance.get(
        "/academic/institute/class/attendance/all/student/class/attendance/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
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
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  const searchAttendance = async () => {
    try {
      setIsLoadingAttn(true);
      const res = await instance.get(
        `academic/student/student/class/${selectedClass}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      setAttendances(data);
      await getAttendanceStatus(
        selectedClass,
        moment(date).format("DD-MM-YYYY")
      );
      setIsLoadingAttn(false);
    } catch (error) {
      setIsLoadingAttn(false);
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  const getAttendanceStatus = async (id, date) => {
    try {
      const res = await instance.get(
        `/academic/institute/class/attendance/specific/class/attendance/user/status/${id}/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      setStatus(data[0]?.status || null);
      setClasAttendanceStatusId(data[0]?.clasAttendanceStatusId || null);
    } catch (error) {
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  const getMapping = async () => {
    setIsLoadingAttn(true);
    try {
      const res = await instance.get(
        "/academic/institute/class/attendance/all/user/attendance/mapping",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      const filteredData = data.filter(
        (item) => item?.attendanceDate === moment(date).format("YYYY-MM-DD")
      );
      setMapping(filteredData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAttn(false);
    }
  };

  const giveAttendance = async (id, status_, mapId) => {
    console.log(mapId, status, status_);

    const body = {
      attendanceDate: moment(date).format("DD-MM-YYYY"),
      classAttendanceId: clasAttendanceStatusId,
      instituteClassId: selectedClass,
      status: status_,
      studentId: id,
    };

    if (status === "COMPLETED") {
      // update
      try {
        const res = await instance.put(
          `/academic/institute/class/attendance/update/student/user/attendance/${mapId}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      // post
      try {
        const res = await instance.post(
          "/academic/institute/class/attendance/add/student/user/attendance",
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteAttendance = async (id) => {
    try {
      const res = await instance.delete(
        `/academic/institute/class/attendance/delete/attendance/status/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const submitAttendance = async (id, date) => {
    try {
      const res = await instance.get(
        `/academic/institute/class/attendance/send/attendance/${id}/${moment(
          date
        ).format("DD-MM-YYYY")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      ToastAndroid.show(
        data || "Attendence sent for today",
        ToastAndroid.SHORT
      );
      if (status === "COMPLETED") {
        await deleteAttendance(clasAttendanceStatusId);
      }
      setModal(false);
      setSelectedClass();
      setStatus();
      setMapping([]);
      setDate(new Date());
      setAttendances([]);
      await getAttendance();
      await getClasses();
    } catch (error) {
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    getAttendance();
    getClasses();
    // getMapping();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={data
            ?.map((item) => item)
            .sort((a, b) => {
              // Convert attendanceDate strings to Date objects for comparison
              const dateA = new Date(
                a.attendanceDate.split("-").reverse().join("-")
              );
              const dateB = new Date(
                b.attendanceDate.split("-").reverse().join("-")
              );

              // Compare the dates
              return dateB - dateA;
            })}
          refreshing={loading}
          onRefresh={async () => {
            await getAttendance();
            await getClasses();
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?.clasAttendanceStatusId}
          renderItem={({ item, index }) => {
            return (
              // class name
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Class Name</Text>
                  <Text>{item?.instituteClassName}</Text>
                </View>

                {/* attendance date */}
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Attendance Date</Text>
                  <Text>{item?.attendanceDate}</Text>
                </View>

                {/* status */}
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Status</Text>
                  <Text
                    style={{
                      color:
                        item?.status === "COMPLETED"
                          ? Colors.secondary
                          : Colors.danger,
                      fontWeight: "600",
                    }}
                  >
                    {item?.status}
                  </Text>
                </View>

                {/* present */}
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Present</Text>
                  <Text
                    style={{
                      color: Colors.black,
                      fontWeight: "600",
                      borderWidth: 1,
                      borderColor: Colors.secondary,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      textAlign: "center",
                    }}
                  >
                    {item?.present}
                  </Text>
                </View>

                {/* absent */}
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Absent</Text>
                  <Text
                    style={{
                      color: Colors.black,
                      fontWeight: "600",
                      borderWidth: 1,
                      borderColor: Colors.danger,
                      borderRadius: 8,
                      textAlign: "center",
                      paddingHorizontal: 8,
                    }}
                  >
                    {item?.absent}
                  </Text>
                </View>

                {/* total */}
                <View style={styles.row}>
                  <Text style={{ fontWeight: "600" }}>Total Student</Text>
                  <Text
                    style={{
                      // color: Colors.black,
                      fontWeight: "600",
                      // borderWidth: 1,
                      // borderColor: Colors.danger,
                      // borderRadius: 8,
                      // textAlign: 'center',
                      // paddingHorizontal: 8
                    }}
                  >
                    {item?.totalStudent}
                  </Text>
                </View>
              </View>
            );
          }}
          // ListFooterComponent={<Footer />}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text>No data found</Text>
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => setModal(true)}
      >
        <FontAwesome5
          name="chalkboard-teacher"
          size={24}
          color={Colors.white}
        />
      </TouchableOpacity>

      {/* attendance modal */}
      <Modal
        visible={modal}
        animationType="slide"
        onRequestClose={() => {
          setModal(false);
          setSelectedClass();
          setDate(new Date());
          setAttendances([]);
        }}
        transparent
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              width: "90%",
              borderRadius: 4,
              padding: 8,
              paddingVertical: 0,
            }}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setModal(false);
                setSelectedClass();
                setDate(new Date());
                setAttendances([]);
              }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

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
              style={[
                styles.card,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.primary,
                },
              ]}
              disabled={!selectedClass}
              onPress={async () => {
                await getMapping();
                await searchAttendance();
              }}
            >
              <Text style={{ color: Colors.white }}>Search</Text>
            </TouchableOpacity>

            {isLoadingAttn ? (
              <ActivityIndicator />
            ) : attendances.length > 0 ? (
              <View
                style={{
                  maxHeight: "50%",
                }}
              >
                <FlatList
                  data={attendances}
                  contentContainerStyle={{
                    paddingVertical: 8,
                    // flex:1
                  }}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={() => (
                    <View style={[styles.row, { marginVertical: 8 }]}>
                      <Text
                        style={{
                          fontWeight: "500",
                          textAlign: "center",
                          marginLeft: 8,
                        }}
                      >
                        Attendance of {date.toDateString()}
                      </Text>
                    </View>
                  )}
                  renderItem={({ item, index }) => {
                    const data = mapping?.find(
                      (item_) => item_?.studentId === item?.studentId
                    );

                    return (
                      <View style={styles.card}>
                        <View style={styles.row}>
                          <Text style={{ width: "20%", lineHeight: 21 }}>
                            {item?.studentName}
                          </Text>
                          <Text style={{ width: "20%", lineHeight: 16 }}>
                            {item?.studentRoll || "roll not present"}
                          </Text>

                          <View style={[styles.row, { columnGap: 4 }]}>
                            <Button
                              title="present"
                              disabled={
                                data?.status === "PRESENT" || item?.disabled
                              }
                              color={Colors.secondary}
                              onPress={async () => {
                                await giveAttendance(
                                  item?.studentId,
                                  "PRESENT",
                                  data?.groupstudentAttendanceMappingId
                                );
                                setAttendances((prev) => {
                                  // add disabled property to current item
                                  const temp = [...prev];
                                  temp[index].disabled = true;
                                  return temp;
                                });
                              }}
                            />

                            <Button
                              title="absent"
                              color={Colors.red}
                              disabled={
                                data?.status === "ABSENT" || item?.disabled
                              }
                              onPress={async () => {
                                await giveAttendance(
                                  item?.studentId,
                                  "ABSENT",
                                  data?.groupstudentAttendanceMappingId
                                );
                                setAttendances((prev) => {
                                  // add disabled property to current item
                                  const temp = [...prev];
                                  temp[index].disabled = true;
                                  return temp;
                                });
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            ) : (
              <Text style={{ textAlign: "center", marginTop: 16 }}>
                No classes found
              </Text>
            )}

            {attendances.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.card,
                  { backgroundColor: Colors.red, alignItems: "center" },
                ]}
                onPress={async () => {
                  await submitAttendance(selectedClass, date);
                }}
              >
                <Text style={{ color: Colors.white }}>
                  {status === "COMPLETED" ? "Update" : "Submit"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <Footer />
    </View>
  );
};

export default Attendance;

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
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
    marginVertical: 8,
  },
});
