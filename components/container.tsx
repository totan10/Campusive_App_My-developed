import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getIsAuth } from '@/redux-store/selectors'
import { useRouter } from 'expo-router'

const container = ({ children }) => {

    const authenticated = useSelector(getIsAuth);
    const router = useRouter();

    useEffect(() => {
        if (authenticated) {
            router.replace("/home")
        } else {
            router.replace("/login")
        }
        // router.replace("/onboarding")
    }, [authenticated])

    return (
        <View style={styles.container}>
            {children}
        </View>

    )
}

export default container

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%'
    }
})