import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';
import {useQuery} from '@tanstack/react-query';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import SaleCard from '../../components/card/saleCard';
import {getSalesProductList} from '../../utils/apiAction';
import {ProductData} from '../../utils/types';
import {IRootState} from '../../redux/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {showLoader} from '../../components/loader/loader';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';

type SalesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.SalesScreen
>;

const SalesScreen: React.FC<SalesScreenProps> = ({navigation}) => {
  const userData = useSelector((state: IRootState) => state.user.userData);

  const {data: sellerOwnProductList, refetch: refetchSalesProductList} =
    useQuery({
      queryKey: ['getSalesProductList'],
      queryFn: () => getSalesProductList(),
      enabled: !!userData,
    });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          showLoader(true);
          await refetchSalesProductList();
        } catch (err) {
          console.error('Failed to fetch product list:', err);
        } finally {
          showLoader(false);
        }
      };

      if (userData) {
        fetchData();
      }
    }, [userData, refetchSalesProductList]),
  );

  const products = sellerOwnProductList?.data?.product || [];

  const EmptyStateMessage = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>No Product Sold</Text>
      {/* <Text style={styles.emptyStateSubtitle}>
        You haven't sold any products yet. Keep promoting your listings!
      </Text> */}
    </View>
  );

  return (
    <TitleBackHeaderContainer title="Sales Activity">
      <FlashList
        data={products as ProductData[]}
        renderItem={({item}) => (
          <SaleCard
            item={item}
            onSelect={() =>
              navigation.navigate(SCREENS.ProductDetailScreen, {
                productId: item.id,
              })
            }
          />
        )}
        estimatedItemSize={150}
        contentContainerStyle={{padding: 16}}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<EmptyStateMessage />}
      />
    </TitleBackHeaderContainer>
  );
};

export default SalesScreen;

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: fontSizes.regular,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
