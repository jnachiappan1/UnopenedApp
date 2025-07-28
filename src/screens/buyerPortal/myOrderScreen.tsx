import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {FlashList} from '@shopify/flash-list';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import OrderListingCard from '../../components/card/orderListingCard';
import {OrderData, ProductData} from '../../utils/types';
import {orderData} from '../../utils/static';

type MyOrderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.MyOrderScreen
>;

const MyOrderScreen: React.FC<MyOrderScreenProps> = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('All');

  const filterData = () => {
    if (selectedTab === 'All') {
      return orderData;
    }
    return orderData.filter(item => item.status === selectedTab);
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
        data={['All', 'Pending', 'In Transit', 'Delivered']}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderTab}
        keyExtractor={item => item}
        style={styles.tabs}
      />
    </View>
  );
  const handleProductSelect = (item: OrderData) => {
    navigation.navigate(SCREENS.OrderTrackScreen, {productId: item});
  };
  return (
    <TitleBackHeaderContainer title="My Orders">
      <FlashList
        data={filterData()}
        renderItem={({item}) => (
          <View style={{paddingHorizontal: 10}}>
            <OrderListingCard item={item} onSelect={handleProductSelect} />
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{paddingEnd: 10}}>{renderHeader()}</View>
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
});
