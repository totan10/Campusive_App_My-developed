import { ActivityIndicator, Modal, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect } from 'react'
import LoginScreen from "react-native-login-screen";
import Colors from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';

import { clearError, login } from '../redux-store/slices/auth'
import { getIsLoading, getError } from '../redux-store/selectors'


const Login = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const loading = useSelector(getIsLoading);
    const error = useSelector(getError);

    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            // console.log(error);
            ToastAndroid.show('Invalid login credentials', ToastAndroid.SHORT);
            dispatch(clearError())
        }
    }, [error])

    return (
        <>
            <LoginScreen
                logoImageSource={require('../assets/logo.png')}
                onLoginPress={() => {
                    if (username && password) {
                        dispatch(login({ username, password }))
                    }
                }}
                onSignupPress={() => { }}
                onEmailChange={setUsername}
                emailPlaceholder='Username'
                onPasswordChange={setPassword}
                enablePasswordValidation={false}
                disableEmailValidation
                disableEmailTooltip
                disableSocialButtons={true}
                signupText='Having issue with Login?'
                signupTextStyle={{
                    color: Colors.primary
                }}
            />
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

export default Login

const styles = StyleSheet.create({})