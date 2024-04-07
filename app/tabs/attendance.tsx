import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Colors from '@/constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { getAttendance, getIsLoadingAttendance, getProfile } from '@/redux-store/selectors'
import { fetchAttendances } from '@/redux-store/slices/attendance'
import Footer from '@/components/footer'

const Attendance = () => {
  const attendance = useSelector(getAttendance);
  const loading = useSelector(getIsLoadingAttendance);
  const profile = useSelector(getProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile?.userCode) {
      dispatch(fetchAttendances(profile?.userCode))
    }
  }, [])

  return (
    <View style={styles.container}>
      {
        loading ? <ActivityIndicator />
          :
          attendance ?
            <FlatList
              showsVerticalScrollIndicator={false}
              data={attendance?.map(item => item).sort((a, b) => new Date(b?.attendanceDate) - new Date(a?.attendanceDate))}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity style={styles.card}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: 'bold' }}>Attendance Date</Text>
                      <Text>
                        {
                          item?.attendanceDate
                        }
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: 'bold' }}>Status</Text>
                      <Text style={{ color: item?.status === "ABSENT" ? Colors.danger : Colors.secondary, fontWeight: 'bold' }}>
                        {
                          item?.status
                        }
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: 'bold' }}>Taken By</Text>
                      <Text style={{}}>
                        {
                          item?.createdBy
                        }
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
              keyExtractor={(item, index) => index.toString()}
              refreshing={loading}
              onRefresh={() => dispatch(fetchAttendances(profile?.userCode))}
              ListEmptyComponent={
                <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                  <Text>No Attendances Found</Text>
                </View>
              }
            />
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>No Attendances Found</Text>
            </View>
      }
    </View>
  )
}

export default Attendance

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  card: {
    backgroundColor: Colors.white,
    elevation: 4,
    borderRadius: 8,
    padding: 8,
    margin: 12,
    rowGap: 8
  }
})