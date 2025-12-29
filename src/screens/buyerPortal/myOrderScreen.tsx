import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {FlashList} from '@shopify/flash-list';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import OrderListingCard from '../../components/card/orderListingCard';
import {ProductData} from '../../utils/types';
import {getMyOrderList} from '../../utils/apiAction';
import {useQuery} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import {IRootState} from '../../redux/store';
import {useFocusEffect} from '@react-navigation/native';

type MyOrderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.MyOrderScreen
>;
const ALLOWED_TABS = ['Pre Transit', 'In Transit', 'Delivered', 'Cancelled'];

const MyOrderScreen: React.FC<MyOrderScreenProps> = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const userData = useSelector((user: IRootState) => user.user.userData);
  const {data: sellerOwnProductList, refetch: refetchsellerOwnProductList} =
    useQuery({
      queryKey: ['getMyOrderList'],
      queryFn: () => getMyOrderList(),
      enabled: !!userData,
    });
  useFocusEffect(
    React.useCallback(() => {
      if (userData) {
        refetchsellerOwnProductList();
      }
    }, [userData, refetchsellerOwnProductList]),
  );

  const normalizeStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pre Transit';
      case 'in_transit':
      case 'shipped':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
      case 'canceled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const generateTabs = (): string[] => {
    // Show all tabs regardless of data availability
    return ['All', ...ALLOWED_TABS];
  };

  const filterData = () => {
    // Fixed: Access the product array correctly
    const allProducts = sellerOwnProductList?.data?.product || [];

    const filteredList =
      selectedTab === 'All'
        ? allProducts
        : allProducts.filter(
            (item: ProductData) =>
              normalizeStatus(item.product_activity_status) === selectedTab,
          );

    const getTime = (item: ProductData) => {
      const updated = item?.updatedAt ? new Date(item.updatedAt).getTime() : 0;
      const created = item?.createdAt ? new Date(item.createdAt).getTime() : 0;
      return Math.max(updated, created);
    };

    return [...filteredList].sort((a: ProductData, b: ProductData) => {
      const bTime = getTime(b);
      const aTime = getTime(a);
      if (bTime !== aTime) return bTime - aTime;
      return (b?.id ?? 0) - (a?.id ?? 0);
    });
  };

  const renderTab = ({item}: {item: string}) => (
    <TouchableOpacity
      key={item}
      onPress={() => setSelectedTab(item)}
      style={[styles.tab, selectedTab === item && styles.activeTab]}>
      <Text
        style={[styles.tabText, selectedTab === item && styles.activeTabText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <FlatList
        data={generateTabs()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderTab}
        keyExtractor={item => item}
        style={styles.tabs}
      />
    </View>
  );

  const filteredData = filterData();

  return (
    <TitleBackHeaderContainer title="My Orders">
      <FlashList
        data={filteredData}
        renderItem={({item}) => (
          <View style={{paddingHorizontal: 10}}>
            <OrderListingCard
              item={item}
              onSelect={selectedItem => {
                try {
                  navigation.navigate(SCREENS.OrderTrackScreen, {
                    productId: item?.id,
                  });
                } catch (navError) {
                  console.error('Navigation error:', navError);
                }
              }}
            />
          </View>
        )}
        keyExtractor={(item: any) => item.id?.toString?.() ?? ''}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{paddingEnd: 10}}>{renderHeader()}</View>
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {selectedTab === 'All'
                ? 'No orders found'
                : `No ${selectedTab.toLowerCase()} orders found`}
            </Text>
          </View>
        }
        estimatedItemSize={120}
        showsVerticalScrollIndicator={false}
      />
    </TitleBackHeaderContainer>
  );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 15,
  },
  tab: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
    borderRadius: 60,
    borderColor: colors.chineseSilver,
    borderWidth: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.black,
  },
  tabText: {
    fontSize: fontSizes.regular,
    color: '#888',
  },
  activeTabText: {
    color: colors.white,
    fontSize: fontSizes.regular,
  },
  tabCountText: {
    fontSize: fontSizes.small,
    color: colors.label,
    textAlign: 'center',
    justifyContent: 'center',
  },
  activeTabCountText: {
    color: colors.label,
    fontSize: fontSizes.small,
  },
  list: {
    paddingBottom: 110,
  },
  countContainer: {
    backgroundColor: '#E7ECDF',
    borderRadius: 20,
    marginStart: 5,
    minWidth: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: fontSizes.medium,
    color: '#666',
  },
});
