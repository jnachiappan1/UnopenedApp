import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';

type MyOrderScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.MyOrderScreen>;

const MyOrderScreen: React.FC<MyOrderScreenProps> = ({ navigation }) => {
  return (
    <TitleBackHeaderContainer title='My Orders' >
      <Text>MyOrderScreen</Text>
    </TitleBackHeaderContainer>
  )
}

export default MyOrderScreen

const styles = StyleSheet.create({})