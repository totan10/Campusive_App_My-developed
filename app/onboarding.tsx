import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TextInputComponent, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { useDispatch, useSelector } from 'react-redux';
import { getIsLoading, getProfile, getUser } from '@/redux-store/selectors';
import { instance } from '@/constants/connection';
import { chnageUsername, resetPassword, tac } from '@/constants/endpoints';
import { profile } from '@/redux-store/slices/auth';
import { router } from 'expo-router';

const onboarding = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(getUser);

    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(false);

    const profileData = useSelector(getProfile);
    const loading = useSelector(getIsLoading)

    const [isLoading, setIsLoading] = useState(false);

    const [username, setUsername] = useState();

    const [currPassword, setCurrPassword] = useState();
    const [newPassword, setNewPassword] = useState();

    useEffect(() => {
        if (profileData && !profileData.firstTimeLogin) {
            router.replace('/home')
        }
    }, [profileData])

    const postUserName = async () => {
        try {
            setIsLoading(true)
            setError(true)
            const res = await instance.post(chnageUsername, {
                property: username
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            dispatch(profile())
            setError(false)
            setActiveStep(0)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show("Username already exists or something went wrong", ToastAndroid.SHORT)
        }
    }

    const resetPassword_ = async () => {
        try {
            setIsLoading(true)
            setError(true);
            const res = await instance.post(resetPassword, {
                property1: currPassword,
                property2: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            dispatch(profile())
            setError(false)
            setActiveStep(1)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
        }
    }

    const postTnC = async () => {
        try {
            setIsLoading(true)
            setError(true);
            const res = await instance.post(tac, {
                property: username || profileData?.userName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            dispatch(profile())
            setError(false)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
        }
    }

    return (
        <View style={styles.container}>
            <ProgressSteps activeStep={activeStep}>
                <ProgressStep
                    previousBtnText=""
                    previousBtnDisabled={true}
                    label="Username"
                    onNext={async () => {
                        if (username) {
                            await postUserName()
                        } else {
                            setError(false)
                            setActiveStep(0)
                        }
                    }}
                    nextBtnText={username ? "Next" : "Skip"}
                    errors={error}
                    nextBtnStyle={styles.btn}
                    nextBtnTextStyle={styles.btnLabel}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, rowGap: 16 }}>
                        <Text style={{ fontWeight: '500' }}>
                            Change your username or skip
                        </Text>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder='Enter username'
                            style={styles.input}
                        />
                    </View>
                </ProgressStep>

                <ProgressStep
                    previousBtnText=""
                    previousBtnDisabled={true}
                    label="Password"
                    errors={error}
                    onNext={async () => {
                        if (currPassword && newPassword) {
                            await resetPassword_()
                        } else {
                            setError(true)
                            ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT)
                        }
                    }}
                    nextBtnStyle={styles.btn}
                    nextBtnTextStyle={styles.btnLabel}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontWeight: '500' }}>
                            Change your password
                        </Text>
                        <TextInput
                            value={currPassword}
                            onChangeText={setCurrPassword}
                            placeholder='Enter current password'
                            style={styles.input}
                        />
                        <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder='Enter new password'
                            style={styles.input}
                        />
                    </View>
                </ProgressStep>

                <ProgressStep
                    previousBtnText=""
                    previousBtnDisabled={true}
                    label="T&C"
                    onSubmit={async () => {
                        await postTnC()
                    }}
                    finishBtnText="Accept"
                    errors={error}
                    nextBtnStyle={styles.btn}
                    nextBtnTextStyle={styles.btnLabel}>
                    <View style={{ alignItems: 'center', marginHorizontal: 16 }}>
                        <Text
                            style={{
                                textAlign: 'left',
                            }}
                        >
                            THESE UNLEASHED TERMS & CONDITIONS (“Agreement” or “Terms”) GOVERN YOUR ACQUISITION AND USE OF UNLEASHED’S SERVICES. IF YOU REGISTER FOR A FREE TRIAL FOR UNLEASHED’S SERVICES, THIS AGREEMENT WILL ALSO GOVERN THAT FREE TRIAL. BY ACCEPTING THIS AGREEMENT, EITHER BY CHECKING A BOX INDICATING YOUR ACCEPTANCE OR BY EXECUTING AN ORDER FORM THAT REFERENCES THIS AGREEMENT, YOU AGREE TO THE TERMS OF THIS AGREEMENT AND THESE TERMS WILL THEN APPLY TO YOU FROM THE TIME THAT YOU FIRST ACCESS THE SERVICES (INCLUDING WHERE YOU HAVE SUBSCRIBED VIA AN UNLEASHED PARTNER). IF YOU ARE ENTERING INTO THIS AGREEMENT ON BEHALF OF A COMPANY OR OTHER LEGAL ENTITY, YOU REPRESENT THAT YOU HAVE THE AUTHORITY TO BIND SUCH AN ENTITY AND ITS AFFILIATES TO THESE TERMS, IN WHICH CASE THE TERMS “YOU” OR “YOUR” SHALL REFER TO SUCH ENTITY AND ITS AFFILIATES. IF YOU DO NOT HAVE SUCH AUTHORITY, OR IF YOU DO NOT AGREE WITH THESE TERMS, YOU MUST NOT ACCEPT THIS AGREEMENT AND MAY NOT USE THE SERVICES. Unleashed reserves the right to amend these Terms at any time, effective upon the posting of such modified Terms on the Website. Unleashed will make every effort to communicate these changes to You via the Website and also via in-app notification. It is likely that the Terms will change over time. It is Your obligation to ensure that You have read and understood the most recent Terms available on the Website. These Terms were last updated in July 2020. They replace any prior agreement(s) between You and Unleashed. When we change these Terms, the “last updated” date above will be updated to reflect the date of the most recent version. 1. DEFINITIONS “Agreement” or “Terms” means these Unleashed Terms and Conditions and includes any notices, policies, guidelines or conditions sent to You by Unleashed or posted on the Website. “Access Fee” means the monthly or annual fee (excluding any taxes and duties) and any applicable one-time-service fees payable by You in accordance with the fee schedule set out on the Website and as agreed to in Your Order Form for the Services. “Affiliates” means any entity that directly or indirectly controls, is controlled by, or is under common control with, You (for example, one of Your subsidiaries). “Billing Contact” means Your nominated contact entity and address for billing purposes. “Confidential Information” means any information which the disclosing party identifies as confidential or which ought reasonably to be considered confidential because of its nature and the manner of its disclosure, including Subscriber Data and information about the disclosing party’s business plans, technical data, and the terms of Your Order but excluding information which is, or becomes, publicly available or that is already known by, or rightfully received by, the other party other than as a result of a breach of an obligation of confidentiality. “Data” means any photos, images, videos, graphics, written content, audio files, code, information or data inputted or uploaded by You (including by an Invited User and, where You have subscribed to the Services via an Unleashed Partner, by that Unleashed Partner on Your behalf) into the Website processed or made available to You or others as a direct result of Your use of the Services and the Website (e.g., Subscriber specific reports). “Intellectual Property Right” means any patent, trade
                        </Text>
                    </View>
                </ProgressStep>
            </ProgressSteps>

            {/* loading modal */}
            <Modal
                visible={isLoading}
                animationType={'fade'}
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
        </View>
    )
}

export default onboarding

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    btn: {
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        backgroundColor: Colors.primary
    },
    btnLabel: {
        color: Colors.white
    },
    input: {
        width: "80%",
        height: 48,
        margin: 12,
        borderWidth: .5,
        borderRadius: 4,
        padding: 10,
        marginTop: 16
    },
})