import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import NotificationCard from '@/components/NotificationCard';
import { getNotifications, getIsLoadingNotifications, getProfile } from '@/redux-store/selectors';
import { fetchNotification } from '@/redux-store/slices/notification';
import Colors from '@/constants/Colors';
const notification = () => {

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const loading = useSelector(getIsLoadingNotifications)
  const dispatch = useDispatch();
  const profile = useSelector(getProfile);
  const notifications=useSelector(getNotifications)

  React.useEffect(() => {
    if (profile?.userCode) {
      dispatch(fetchNotification(profile?.userCode))
    }
  }, [])

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     const fetchedNotifications = await getNotifications(); // Replace with API call logic
  //     setNotifications(fetchedNotifications);
  //   };
  //   fetchNotifications();
  // }, []);

  return (
    <View style={styles.container}>
      {
        notifications && notifications?.length > 0 ?
          <FlatList
            data={notifications?.map(item => item).sort((a, b) => new Date(b?.createOn) - new Date(a?.createdOn))}
            renderItem={({ item }) => (
              <NotificationCard {...item} />
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            refreshing={loading}
            onRefresh={() => {
              dispatch(fetchNotification(profile?.userCode))
            }}
          />
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No Notications to show</Text>
          </View>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // justifyContent: 'center',
    // alignItems: 'center'
  }
});

export default notification;
