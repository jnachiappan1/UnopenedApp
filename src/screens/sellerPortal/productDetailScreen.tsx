import { FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { fontSizes, width } from '../../utils/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import StatusBadge from '../../components/card/statusBadge';
import fonts from '../../assets/fonts/fonts';
import InfoRow from '../../components/card/infoRow';
import Button from '../../components/button/buttons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addProduct, getSellerProductByID, updateProductStatus } from '../../utils/apiAction';
import moment from 'moment';
import { handleError, handleSettled } from '../../utils/method';
import { showAlert } from '../../components/cAlert';
import { image_url } from '../../utils/api';
import { showLoader } from '../../components/loader/loader';

type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.ProductDetailScreen>;
interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params;
  const flatListRef = useRef<FlatList<ProductImage>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: productDetail, refetch: refetchProductDetail } = useQuery({
    queryKey: ['getSellerProductByID'],
    queryFn: () => getSellerProductByID(productId),
  });
  const { mutate } = useMutation({
    mutationFn: (data: globalThis.FormData) => updateProductStatus(productId, data),
    onSuccess: data => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Product',
        description: 'Product withdraw successfully',
        doneText: 'Okay',
        onDonePress: () => navigation.goBack(),
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });
  const Submit = async () => {
    showAlert({
      isVisible: true,
      type: 'success',
      title: 'Product',
      description: 'Are you sure you want to withdraw this product',
      doneText: 'Okay',
      deleteText: "cancel",
      onDonePress: () => {
        const formData = new FormData()
        formData.append('product_status', "withdrawn");
        showLoader(true);
        mutate(formData);
      },
      onDeletePress: () => {

      },
    });

  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
    setCurrentIndex(index);
  };
console.log(productDetail?.data,"productDetail?.data?.----");

  return (
    <TitleBackHeaderContainer isBack title='Product Details' >
      <View style={styles.imageDetailContainer}>
        <FlatList<ProductImage>
          ref={flatListRef}
          data={productDetail?.data?.product[0]?.product_image}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <Image
              // source={{ uri: item.image }}
              source={{ uri: image_url+item.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}
        />

        {/* <Image
          source={{ uri: productDetail?.data?.product[0]?.product_image?.[0]?.image }}
          style={styles.productImage}
          resizeMode='stretch' /> */}
        <StatusBadge status={productDetail?.data?.product[0]?.product_status} statusStyle={styles.statusStyle} />
        <Text style={styles.titleStyle}>{productDetail?.data?.product[0]?.name}</Text>
        <Text style={styles.descriptionStyle}>{productDetail?.data?.product[0]?.description}</Text>
        <InfoRow title="Brand" subtitle={
          productDetail?.data?.product[0]?.brand
        }
          subtitleStyle={styles.subtitleStyle} />
        <InfoRow title="Category" subtitle={
          productDetail?.data?.product[0]?.product_category?.name
        }
          subtitleStyle={styles.subtitleStyle} />
        <InfoRow title="SKU / Barcode" subtitle={
          productDetail?.data?.product[0]?.barcode
        } subtitleStyle={styles.subtitleStyle} />
        <InfoRow title="MRSP" subtitle={
          productDetail?.data?.product[0]?.msrp
        } subtitleStyle={styles.mrspStyle} />
        <InfoRow title="Listing Price" subtitle={
          productDetail?.data?.product[0]?.price
        } subtitleStyle={styles.mrspStyle} />
      </View>
      <View style={styles.imageDetailContainer}>
        <Text style={styles.headingStyle}>Listing Details</Text>
        <InfoRow title="Created On" style={styles.containerStyle} subtitle={moment(productDetail?.data?.product[0]?.createdAt).format('DD MMMM YYYY')} showColon />
        <InfoRow title="Last Updated" style={styles.containerStyle} subtitle={moment(productDetail?.data?.product[0]?.updatedAt).format('DD MMMM YYYY')} showColon />
        {/* <InfoRow title="Buyer Name" style={styles.containerStyle} subtitle="Jay" showColon />
        <View style={styles.row}>
          <Text style={styles.title}>{"Delivery Status"}</Text>
          <Text style={styles.colon}>{': '}</Text>
          <StatusBadge status={"Delivered"} statusStyle={{}} />
        </View> */}
      </View>
      {!['sold', 'withdrawn', 'rejected'].includes(productDetail?.data?.product?.[0]?.product_status) && (
  <Button
    title={'Withdraw'}
    style={styles.withdrawButton}
    onPress={Submit}
  />
)}

    </TitleBackHeaderContainer>
  )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
  imageDetailContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  containerStyle: { paddingHorizontal: 0, },
  productImage: {
    width: width - 32,
    height: 210,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusStyle: {
    marginTop: 10
  },
  subtitleStyle: { textTransform: 'capitalize' },
  titleStyle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: '#333333',
    marginVertical: 5,
    textTransform: 'capitalize'
  },
  descriptionStyle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: '#666666',
    marginBottom: 10,
    textTransform: 'capitalize'
  },
  mrspStyle: {
    fontFamily: fonts.bold,
  },
  headingStyle: {
    fontSize: fontSizes.medium,
    marginBottom: 10,
    fontFamily: fonts.bold,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: colors.white,
    alignItems: 'center'
  },
  title: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
    width: "30%"
  },
  colon: {
    marginHorizontal: 4,
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
  },
  withdrawButton: {
    backgroundColor: colors.primary,
    // width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
})