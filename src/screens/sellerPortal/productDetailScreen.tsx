import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { fontSizes, width } from '../../utils/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import colors from '../../utils/colors';

type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.ProductDetailScreen>;

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation }) => {

  return (
    <TitleBackHeaderContainer isBack title='Product Details' >
     <View style={{backgroundColor:colors.white,
      marginHorizontal:12,
      marginVertical:12,
      borderRadius:12,
      paddingHorizontal:20,paddingVertical:20,alignItems:"center"}}>
     <Image 
     source={{ uri: 'https://s3.ap-south-1.amazonaws.com/happimobiles/product-main-images/fdf21db5-35a6-4c51-a8e0-829c8784d757.webp' }}
      style={styles.productImage}
      resizeMode='stretch'/>
     </View>
    </TitleBackHeaderContainer>
  )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
  productImage: {
    width: width-100,
    height: 210,
    borderRadius: 8,
    marginRight: 12,
  },
})