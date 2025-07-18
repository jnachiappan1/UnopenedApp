import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { FlashList } from '@shopify/flash-list'
import { salesData } from '../../utils/static'
import SaleCard from '../../components/card/saleCard'

const SalesScreen = () => {
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