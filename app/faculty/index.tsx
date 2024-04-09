// import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import Colors from '@/constants/Colors'
// import { AntDesign, MaterialIcons } from '@expo/vector-icons'
// import { logout } from '@/redux-store/slices/auth'
// import { useDispatch } from 'react-redux'
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
// import Attendance from './tabs/attendance'
// import Assignment from './tabs/assignment'
// import Profile from './tabs/profile'
// import Footer from '@/components/footer'

// const index = () => {
//     const dispatch = useDispatch();
//     const Tab = createMaterialTopTabNavigator();
//     return (
//         <View style={styles.container}>
//             <View
//                 style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                     marginHorizontal: 8,
//                     marginTop: 8,
//                     marginBottom: 16
//                 }}
//             >
//                 <Text
//                     style={{
//                         fontWeight: '500',
//                         fontSize: 21,
//                         color: Colors.white
//                     }}
//                 >
//                     Campusive
//                 </Text>

//                 <View style={{ flexDirection: 'row', columnGap: 24 }}>
//                     <TouchableOpacity
//                         onPress={() => {
//                             Linking.openURL('https://notification.campusive.com/login')
//                         }}
//                     >
//                         <MaterialIcons name="notifications-none" size={24} color={Colors.white} />
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         onPress={() => {
//                             Alert.alert("", "Are you sure?", [
//                                 {
//                                     text: "Logout",
//                                     onPress(value) {
//                                         dispatch(logout())
//                                     },
//                                 },
//                                 {
//                                     text: 'cancel',
//                                     onPress(value) {

//                                     },
//                                     style: 'cancel'
//                                 }
//                             ])
//                         }}
//                     >
//                         <AntDesign name="logout" size={21} color={Colors.white} />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <Tab.Navigator
//                 style={{
//                     backgroundColor: Colors.primary
//                 }}
//                 screenOptions={({ route, navigation }) => {
//                     return {
//                         tabBarIndicatorContainerStyle: {
//                             backgroundColor: Colors.primary,
//                         },
//                         tabBarIndicatorStyle: {
//                             backgroundColor: Colors.red,
//                             height: 3
//                         },
//                         tabBarLabel: ({ focused, children, color }) => {
//                             return (
//                                 <Text
//                                     style={{
//                                         fontSize: 16,
//                                         color: focused ? "#fff" : "#aaa",
//                                         fontWeight: "bold",
//                                     }}
//                                 >
//                                     {children}
//                                 </Text>
//                             );
//                         },
//                     };
//                 }}
//             >
//                 <Tab.Screen name="Attendance" component={Attendance} />
//                 <Tab.Screen name="Assignment" component={Assignment} />
//                 <Tab.Screen name="Profile" component={Profile} />
//             </Tab.Navigator>
//         </View>
//     )
// }

// export default index

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.primary
//     }
// })


import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from 'react'
import Colors from '@/constants/Colors'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { logout } from '@/redux-store/slices/auth'
import { useDispatch } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Attendance from './tabs/attendance'
import Assignment from './tabs/assignment'
import Profile from './tabs/profile'
import notification from './tabs/notification';
import Footer from '@/components/footer'
const Index = () => {
    const dispatch = useDispatch();
    const Drawer = createDrawerNavigator();
    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: 8,
                    marginTop: 8,
                    marginBottom: 16
                }}
            >
                <Text
                    style={{
                        fontWeight: '500',
                        fontSize: 21,
                        color: Colors.white
                    }}
                >
                    Campusive
                </Text>

                <View style={{ flexDirection: 'row', columnGap: 24 }}>
                    <TouchableOpacity
                        onPress={() => {
                           // Linking.openURL('https://notification.campusive.com/login')

                        }}
                    >
                        <MaterialIcons name="notifications-none" size={24} color={Colors.white} />
                    </TouchableOpacity>

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
                initialRouteName="notification"
                drawerContentOptions={{
                    activeTintColor: Colors.red,
                    labelStyle: { fontSize: 16, fontWeight: "bold" },
                }}
            >
                <Drawer.Screen name="Profile" component={Profile} />
                <Drawer.Screen name="Notification" component={notification} />
                <Drawer.Screen name="Attendance" component={Attendance} />
                <Drawer.Screen name="Assignment" component={Assignment} />
            </Drawer.Navigator>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary
    }
})
