import { ActivityIndicator, Alert, FlatList, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, getUser } from '@/redux-store/selectors'
import { instance } from '@/constants/connection'
import * as ImagePicker from 'expo-image-picker';
import { profileImage, studentProfile } from '@/constants/endpoints'
import { Entypo } from '@expo/vector-icons'
import { profile } from '@/redux-store/slices/auth'
import Footer from '@/components/footer'

const Profile = () => {
  const dispatch = useDispatch();
  const profile__ = useSelector(getProfile);
  const { token } = useSelector(getUser);
  const [profile_, setProfile] = useState();
  const profileData = useSelector(getProfile);
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);

  const [work, setWork] = React.useState([])
  const [career, setCareer] = React.useState([])

  // get profile image
  const getProfileImage = async () => {
    if (profileData?.userProfilePicture) {
      const res = await instance.get(profileImage(profileData?.userProfilePicture), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = res.data;
      setProfilePicture("data:image/png;base64," + data);
    }
  }

  const getWork = async () => {
    try {
      const res = await instance.get('/user/career/work/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = res.data;
      setWork(data)
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT)
    }
  }

  const getCareer = async () => {
    try {
      const res = await instance.get('/user/academic/career/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = res.data;
      setCareer(data)
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT)
    }
  }

  const pickImage = async (type: string) => {
    if (type === 'gallery') {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: .2,
      });

      console.log(result);

      if (!result.canceled) {
        await uploadImage(result.assets[0])
        // setImage(result.assets[0]);
      }
    }
    else {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: .2,
      });

      console.log(result);

      if (!result.canceled) {
        await uploadImage(result.assets[0])
        // setImage(result.assets[0]);
      }
    }
  };

  const uploadImage = async (uri: ImagePicker.ImagePickerAsset) => {
    try {
      setLoading(true)
      const fd = new FormData();
      fd.append("files",
        {
          uri: uri.uri,
          name: "" + new Date().getMilliseconds(),
          type: uri.mimeType
        }
      );
      const res = await instance.postForm("/master/file//upload/PROFILE_PIC", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      const data = res.data;
      const { fileId } = data[0];
      await uploadPhotoPath(fileId);
    } catch (err) {
      setLoading(false);
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
    }
  }

  const uploadPhotoPath = async (id) => {
    try {
      const res = await instance.post("/user/me/profilePic/PROFILE_PHOTO", {
        property: id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      const data = res.data;
      dispatch(profile())
      await getProfileImage();
      setLoading(false)
    } catch (error) {
      setLoading(false)
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
    }
  }

  useEffect(() => {
    getWork();
    getCareer();
  }, [])

  useEffect(() => {
    if (profileData) {
      getProfileImage();
    }
  }, [profileData])

  return (
    <View style={styles.container}>

      {/* profile image */}
      <View style={{
        backgroundColor: Colors.white,
        marginHorizontal: 4,
        margin: 10
      }}>
        <ImageBackground
          source={{ uri: 'https://source.unsplash.com/1800x200/?nature,water' }}
          style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderRadius: 10, paddingVertical: 8 }}>
          <Image
            source={{ uri: profilePicture || 'https://st4.depositphotos.com/9998432/24359/v/450/depositphotos_243599464-stock-illustration-person-gray-photo-placeholder-man.jpg' }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50
            }}
          />

          <TouchableOpacity style={{ alignSelf: 'flex-end', padding: 8 }} onPress={() => {
            Alert.alert(
              "",
              "Choose from",
              [
                {
                  text: "Gallery",
                  onPress: () => pickImage('gallery'),
                },
                {
                  text: "Camera",
                  onPress: () => pickImage('camera'),
                },
              ], { cancelable: true }
            )
          }}>
            <Entypo name="camera" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </ImageBackground>
      </View>


      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{ rowGap: 4 }}>
            <Text style={{ fontWeight: '600' }}>Full Name</Text>
            <Text style={{}}>
              {
                profile__?.firstName + " " + profile__?.lastName
              }
            </Text>
          </View>

          <View style={{ rowGap: 4 }}>
            <Text style={{ fontWeight: '600' }}>Username</Text>
            <Text style={{}}>
              {
                profile__?.userName
              }
            </Text>
          </View>
        </View>
        {/* </View> */}
      </View>

      <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 8 }}>Work Details</Text>

      <View>
        {work.length > 0 && <FlatList
          data={work}
          renderItem={({ item }) => (
            <View style={[styles.card]}>
              <View style={[styles.row]}>
                <View style={{ rowGap: 4 }}>
                  <Text style={{ fontWeight: '600' }}>Name of Organization</Text>
                  <Text>{item?.companyName}</Text>

                  <View style={{ height: 8 }} />

                  <Text style={{ fontWeight: '600' }}>Started On:</Text>
                  <Text>{item?.startedOn}</Text>
                </View>

                <View style={{ rowGap: 4 }}>
                  <Text style={{ fontWeight: '600' }}>Position</Text>
                  <Text>{item?.position}</Text>

                  <View style={{ height: 8 }} />

                  <Text style={{ fontWeight: '600' }}>Ended On:</Text>
                  <Text>{item?.endedOn}</Text>
                </View>


              </View>
            </View>
          )}
          keyExtractor={item => item?.userCareerWorkId}
        />}

        {career.length > 0 && <FlatList
          data={career}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={[styles.row]}>
                <View style={{ rowGap: 4 }}>
                  <Text style={{ fontWeight: '600' }}>Institute Name:</Text>
                  <Text>{item?.instituteName}</Text>

                  <View style={{ height: 8 }} />

                  <Text style={{ fontWeight: '600' }}>Started On:</Text>
                  <Text>{item?.startedOn}</Text>
                </View>

                <View style={{ rowGap: 4 }}>
                  <Text style={{ fontWeight: '600' }}>Degree:</Text>
                  <Text>{item?.degree}</Text>

                  <View style={{ height: 8 }} />

                  <Text style={{ fontWeight: '600' }}>Ended On:</Text>
                  <Text>{item?.endedOn}</Text>
                </View>


              </View>
            </View>
          )}
          keyExtractor={item => item?.userAcademicCareerId}
        />}
      </View>



      <Modal
        visible={loading}
        transparent
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View
            style={{
              backgroundColor: Colors.white, justifyContent: 'center',
              alignItems: 'center',
              width: '80%',
              borderRadius: 8,
              paddingVertical: 16
            }}
          >
            <ActivityIndicator color={Colors.primary} size={"large"} />
          </View>
        </View>
      </Modal>

      <View style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Footer />
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
})