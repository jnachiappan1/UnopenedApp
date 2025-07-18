import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer'

const bHomeScreen = () => {
  return (
    <HeaderHomeContainer
    title={'Welcome,'}
    userName={"Hello John"}
    isHome
    onSearchPress={() => { }}
  >
      <Text>bHomeScreen</Text>
    </HeaderHomeContainer>
  )
}

export default bHomeScreen

const styles = StyleSheet.create({})