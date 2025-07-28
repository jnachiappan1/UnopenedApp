import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { FlashList } from '@shopify/flash-list'
import { salesData } from '../../utils/static'
import SaleCard from '../../components/card/saleCard'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation'


type SalesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.SalesScreen
>;

  const SalesScreen: React.FC<SalesScreenProps> = ({
    route,
    navigation,
  }) => {
  return (
    <TitleBackHeaderContainer title='Sales Activity' >
      <FlashList
        data={salesData}
        renderItem={({ item }) => <SaleCard item={item} />}
        estimatedItemSize={150}
        contentContainerStyle={{ padding: 16 }}
        keyExtractor={(item) => item.id}
      />
    </TitleBackHeaderContainer>
  )
}

export default SalesScreen

const styles = StyleSheet.create({})