import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';

type BrowseScreenProps= NativeStackScreenProps<RootStackParamList, SCREENS.BrowseScreen>;

const BrowseScreen: React.FC<BrowseScreenProps> = ({ navigation }) => {

  return (
    <TitleBackHeaderContainer title='Browser Screen' >
      <Text>BrowseScreen</Text>
    </TitleBackHeaderContainer>
  )
}

export default BrowseScreen

const styles = StyleSheet.create({})