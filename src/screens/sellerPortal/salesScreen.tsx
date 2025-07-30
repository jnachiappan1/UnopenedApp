import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { FlashList } from '@shopify/flash-list'
import { salesData } from '../../utils/static'
import SaleCard from '../../components/card/saleCard'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation'
import { useSelector } from 'react-redux'
import { IRootState } from '../../redux/store'
import { useQuery } from '@tanstack/react-query'
import { getSalesProductList } from '../../utils/apiAction'


type SalesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.SalesScreen
>;

  const SalesScreen: React.FC<SalesScreenProps> = ({
    route,
    navigation,
  }) => {
    const userData = useSelector((user: IRootState) => user.user.userData);
    const { data: sellerOwnProductList, refetch: refetchsellerOwnProductList } = useQuery({
      queryKey: ['getSalesProductList'],
      queryFn: () => getSalesProductList(),
      enabled: !!userData, 
    });
    console.log(sellerOwnProductList,"sellerOwnProductList---");
    
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