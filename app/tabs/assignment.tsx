import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssignments } from '@/redux-store/slices/assignments'
import { getAssignments, getIsLoadingAssignments, getProfile } from '@/redux-store/selectors'
import AssignmentCard from '@/components/assignmentCard'
import Footer from '@/components/footer'

const Assignment = () => {
  const dispatch = useDispatch();
  const profile = useSelector(getProfile);
  const assignments = useSelector(getAssignments);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const loading = useSelector(getIsLoadingAssignments)

  React.useEffect(() => {
    if (profile?.userCode) {
      dispatch(fetchAssignments(profile?.userCode))
    }
  }, [])

  return (
    <View style={styles.container}>
      {
        assignments && assignments?.length > 0 ?
          <FlatList
            data={assignments?.map(item => item).sort((a, b) => new Date(b?.attendanceDate) - new Date(a?.attendanceDate))}
            renderItem={({ item }) => (
              <AssignmentCard {...item} />
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            refreshing={loading}
            onRefresh={() => {
              dispatch(fetchAssignments(profile?.userCode))
            }}
          />
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No Assignments Found</Text>
          </View>
      }
    </View>
  )
}

export default Assignment

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // justifyContent: 'center',
    // alignItems: 'center'
  }
})