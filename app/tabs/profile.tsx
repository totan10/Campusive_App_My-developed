import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, getUser } from '@/redux-store/selectors'
import { profileImage, studentProfile } from '@/constants/endpoints'
import { instance } from '@/constants/connection'
import { Entypo } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { profile } from '@/redux-store/slices/auth'
import Footer from '@/components/footer'

const Profile = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(getUser);
  const profileData = useSelector(getProfile);
  const [profile_, setProfile] = useState();
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);

  // get profile
  const getProfile_ = async () => {
    try {
      const res = await instance.get(`${studentProfile(profileData?.userCode)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  }

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

  useEffect(() => {
    getProfile_();
    getProfileImage();
  }, [])

  useEffect(() => {
    if (profileData) {
      getProfileImage();
    }
  }, [profileData])

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

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {profile_ ?
          <View style={{ marginBottom: 8 }}>
            {/* profile image */}
            <View style={{
              backgroundColor: Colors.white,
              elevation: 4,
              borderRadius: 10,
              padding: 10,
              marginHorizontal: 4,
              margin: 10
            }}>
              <View
                style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', }}>
                <Image source={{ uri: profilePicture || 'https://st4.depositphotos.com/9998432/24359/v/450/depositphotos_243599464-stock-illustration-person-gray-photo-placeholder-man.jpg' }} style={{ width: 100, height: 100, borderRadius: 50 }} />
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
              </View>

              <View
                style={{
                  margin: 8,
                  marginTop: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'

                }}
              >
                <View style={{ rowGap: 8 }}>
                  <Text style={{ color: Colors.primary, fontWeight: '500' }}>{profile_?.firstName + " " + profile_?.lastName}</Text>

                  <Text style={{ color: Colors.black, fontWeight: 'bold' }}>
                    <Text style={{ color: Colors.gray }}>Roll No </Text >
                    {profile_?.roll}
                  </Text>

                </View>

                <View style={{ rowGap: 8 }}>
                  <Text style={{ color: Colors.black, fontWeight: 'bold' }}>
                    {profile_?.studentClass}
                  </Text>
                  <Text style={{ color: Colors.gray, fontWeight: '500' }}>Group Name</Text>
                </View>
              </View>
            </View>

            {/* basic details */}
            <View
              style={{
                backgroundColor: Colors.white,
                elevation: 4,
                borderRadius: 10,
                padding: 10,
                margin: 10,
                rowGap: 12,
                marginHorizontal: 4,
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', textDecorationLine: 'underline' }}>Basic Details</Text>
              <Text style={{ fontWeight: '500' }}>
                User ID:
                <Text style={{ color: Colors.gray }}>   {profile_?.userCode}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>
                Date Of Admission:
                <Text style={{ color: Colors.gray }}>   {profile_?.admissionDate}</Text>
              </Text>
            </View>

            {/* personal details */}
            <View
              style={{
                backgroundColor: Colors.white,
                elevation: 4,
                borderRadius: 10,
                padding: 10,
                margin: 10,
                rowGap: 12,
                marginHorizontal: 4,
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', textDecorationLine: 'underline' }}>Personal Details</Text>

              <Text style={{ fontWeight: '500' }}>
                Date Of Birth:
                <Text style={{ color: Colors.gray }}>   {profile_?.dob}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>
                Gender:
                <Text style={{ color: Colors.gray }}>   {profile_?.gender}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>
                Blood Group:
                <Text style={{ color: Colors.gray }}>   {profile_?.bloodGroup}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>
                Mother Tongue:
                <Text style={{ color: Colors.gray }}>   {profile_?.motherTongue}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>Residential Phone Number:
                <Text style={{ color: Colors.gray }}>   {profile_?.residentialPhone || ""}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>Residential Address:
                <Text style={{ color: Colors.gray }}>   {profile_?.residentialAddress}</Text>
              </Text>

            </View>

            {/* guardian details */}
            <View
              style={{
                backgroundColor: Colors.white,
                elevation: 4,
                borderRadius: 10,
                padding: 10,
                margin: 10,
                rowGap: 12,
                marginHorizontal: 4,
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', textDecorationLine: 'underline' }}>Guardian Details</Text>

              <Text style={{ fontWeight: '500' }}>
                Name of guardian:
                <Text style={{ color: Colors.gray }}>   {profile_?.guardianFullName}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>
                Official Email ID:
                <Text style={{ color: Colors.gray }}>   {profile_?.emailAddress}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>
                phone number:
                <Text style={{ color: Colors.gray }}>   {profile_?.mobileNumber}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>
                Whatsapp Number:
                <Text style={{ color: Colors.gray }}>   {profile_?.watsappNumber}</Text>
              </Text>

              <Text style={{ fontWeight: '500' }}>Address:
                <Text style={{ color: Colors.gray }}>   {profile_?.permanentAddress}</Text>
              </Text>

            </View>

          </View>
          :
          <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>


        }
      </ScrollView>
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
    </>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 8,
  }
})