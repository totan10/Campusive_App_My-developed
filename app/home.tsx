// import {
//   ActivityIndicator,
//   Alert,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ProgressBarAndroid
// } from "react-native";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logout, profile } from "@/redux-store/slices/auth";
// import { getProfile } from "@/redux-store/selectors";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import SpInAppUpdates, {
//   NeedsUpdateResponse,
//   StatusUpdateEvent,
//   IAUUpdateKind,
//   StartUpdateOptions,
//   AndroidInstallStatus,
// } from 'sp-react-native-in-app-updates';
// import { AntDesign } from "@expo/vector-icons";
// import { Redirect } from "expo-router";

// import Attendance from "./tabs/attendance";
// import Assignment from "./tabs/assignment";
// import Profile from "./tabs/profile";
// import FeePayment from "./tabs/FeePayment";
// import Colors from "@/constants/Colors";
// import Footer from "@/components/footer";

// import 

// const home = () => {
//   const profile_ = useSelector(getProfile);
//   const dispatch = useDispatch();
//   const Tab = createMaterialTopTabNavigator();

//   const inAppUpdates = new SpInAppUpdates(
//     true // isDebug
//   );

//   const onStatusUpdate = (res: StatusUpdateEvent) => {
//     const {
//       status,
//       bytesDownloaded,
//       totalBytesToDownload,
//     } = res;
//     // do something
//     if (status === AndroidInstallStatus.DOWNLOADED) {
//     }
//     console.log(`@@ ${JSON.stringify(res)}`);
//   }

//   // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
//   inAppUpdates.checkNeedsUpdate().then(async (result) => {
//     if (result.shouldUpdate) {
//       let updateOptions: StartUpdateOptions = {};
//       if (Platform.OS === 'android') {
//         // android only, on iOS the user will be promped to go to your app store page
//         updateOptions = {
//           updateType: IAUUpdateKind.FLEXIBLE,
//         };
//       }
//       await inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
//       inAppUpdates.installUpdate()
//     }
//   });

//   useEffect(() => {
//     dispatch(profile());
//   }, []);

//   if (!profile_) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ActivityIndicator color={Colors.primary} size={"large"} />
//       </View>
//     );
//   }

//   // firsttimelogin, redirect to onboarding page
//   if (profile_?.firstTimeLogin) {
//     return <Redirect href={"/onboarding"} />;
//   }

//   if (profile_?.roleCode !== "ROLE_INST_STUDENT") {
//     return <Redirect href={"/faculty/"} />;
//   }

//   return (
//     <View style={styles.container}>
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginHorizontal: 8,
//           marginTop: 8,
//           marginBottom: 16,
//         }}
//       >
//         <Text
//           style={{
//             fontWeight: "500",
//             fontSize: 21,
//             color: Colors.white,
//           }}
//         >
//           Campusive
//         </Text>

//         <TouchableOpacity
//           style={
//             {
//               // marginTop: 8,
//               // marginRight: 8,
//               // alignSelf: 'flex-end'
//             }
//           }
//           onPress={() => {
//             Alert.alert("", "Are you sure?", [
//               {
//                 text: "Logout",
//                 onPress(value) {
//                   dispatch(logout());
//                 },
//               },
//               {
//                 text: "cancel",
//                 onPress(value) { },
//                 style: "cancel",
//               },
//             ]);
//           }}
//         >
//           <AntDesign name="logout" size={24} color={Colors.white} />
//         </TouchableOpacity>
//       </View>

//       <Tab.Navigator
//         style={{
//           backgroundColor: Colors.primary,
//         }}
//         screenOptions={({ route, navigation }) => {
//           return {
//             tabBarIndicatorContainerStyle: {
//               backgroundColor: Colors.primary,
//             },
//             tabBarIndicatorStyle: {
//               backgroundColor: Colors.red,
//               height: 3,
//             },
//             tabBarLabel: ({ focused, children, color }) => {
//               return (
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     color: focused ? "#fff" : "#aaa",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {children}
//                 </Text>
//               );
//             },
//           };
//         }}
//       >
//         <Tab.Screen name="Attendance" component={Attendance} />
//         <Tab.Screen name="Assignment" component={Assignment} />
//         <Tab.Screen name="Profile" component={Profile} />
//         <Tab.Screen name="My Fee" component={FeePayment} />
//       </Tab.Navigator>
//       <Footer />
//     </View>
//   );
// };

// export default home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.primary,
//   },
// });

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, profile } from "@/redux-store/slices/auth";
import { getProfile } from "@/redux-store/selectors";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {ActivityIndicator, Alert, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Footer from "@/components/footer";
import { Redirect } from "expo-router";
import Attendance from "./tabs/attendance";
import Assignment from "./tabs/assignment";
import Profile from "./tabs/profile";
import FeePayment from "./tabs/FeePayment";
import Notification from "./tabs/notification";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <View style={{ paddingHorizontal: 16 }}>
      <DrawerItemList {...props} />
    </View>
  </DrawerContentScrollView>
);

const Home = () => {
  const profile_ = useSelector(getProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profile());
  }, []);

  if (!profile_) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={Colors.primary} size={"large"} />
      </View>
    );
  }

  // firsttimelogin, redirect to onboarding page
  if (profile_?.firstTimeLogin) {
    return <Redirect href={"/onboarding"} />;
  }

  if (profile_?.roleCode !== "ROLE_INST_STUDENT") {
    return <Redirect href={"/faculty/"} />;
  }

  return (
    <View style={styles.container}>      
      <View style={styles.header}>
        <Text style={styles.title}>Campusive</Text>
        <View style={styles.headerIcons}>
          {/* Add notification icon */}
          {/* <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="notifications-none" size={24} color={Colors.white} />
          </TouchableOpacity> */}
          {/* Add logout icon */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert("", "Are you sure?", [
                {
                  text: "Logout",
                  onPress(value) {
                    dispatch(logout())
                  },
                },
                {
                  text: 'cancel',
                  onPress(value) {

                  },
                  style: 'cancel'
                }
              ])
            }}
          >
            <AntDesign name="logout" size={21} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerTintColor: Colors.white,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          drawerActiveTintColor: Colors.primary,
          drawerInactiveTintColor: Colors.black,
          drawerLabelStyle: {
            fontSize: 16,
          },
        }}
      >
        <Drawer.Screen 
          name="Profile" 
          component={Profile} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Attendance" 
          component={Attendance} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons name="event-note" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Assignment" 
          component={Assignment} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons name="assignment" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="My Fee" 
          component={FeePayment} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons name="attach-money" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Notifications" 
          component={Notification} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons name="notifications" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  title: {
    fontWeight: "500",
    fontSize: 21,
    color: Colors.white,
  },
  headerIcons: {
    flexDirection: 'row', 
    columnGap: 24
  }
});

export default Home;
