import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Footer = () => {
    return (
        <View style={{ backgroundColor: 'white', }}>
            <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 9 }}>
                © COPYRIGHT {new Date().getFullYear()}  Sysbean India - ALL RIGHTS RESERVED.
            </Text>
        </View>
    )
}

export default Footer

const styles = StyleSheet.create({})