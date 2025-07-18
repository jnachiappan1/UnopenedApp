import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { productData } from '../../utils/static';
import ProductListingCard from '../../components/card/productListingCard';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { ProductData } from '../../utils/types';

type ProductListScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.ProductListScreen>;

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('All');

  const filterData = () => {
    if (selectedTab === 'All') {
      return productData;
    }
    return productData.filter(item => item.status === selectedTab);
  };

  const getTabCounts = () => {
    const counts: { [key: string]: number } = {
      All: productData.length,
      Active: productData.filter(item => item.status === 'Active').length,
      Sold: productData.filter(item => item.status === 'Sold').length,
      'In Review': productData.filter(item => item.status === 'In Review').length,
    };
    return counts;
  };

  const tabCounts = getTabCounts();

  const renderTab = ({ item }: { item: string }) => (
    <TouchableOpacity
      key={item}
      onPress={() => setSelectedTab(item)}
      style={[
        styles.tab,
        selectedTab === item && styles.activeTab,
      ]}
    >
      <Text style={[styles.tabText, selectedTab === item && styles.activeTabText]}>
        {item}
      </Text>
      <View style={styles.countContainer}>
        <Text style={[styles.tabCountText, selectedTab === item && styles.activeTabCountText]}>
          {tabCounts[item] ?? 0}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <FlatList
        data={['All', 'Active', 'Sold', 'In Review']}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderTab}
        keyExtractor={(item) => item}
        style={styles.tabs}
      />
    </View>
  );
  const handleProductSelect = (item: ProductData) => {
    console.log('Selected product:', item);
    navigation.navigate(SCREENS.ProductDetailScreen, { productId: item.id });
  }
  return (
    <TitleBackHeaderContainer title='Products Listing' >
      <FlashList
        data={filterData()}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 10 }}>
            <ProductListingCard
              item={item}
              onSelect={handleProductSelect}
            />
          </View>

        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ paddingEnd: 10 }}>
            {renderHeader()}
          </View>
        }
        estimatedItemSize={120}
        showsVerticalScrollIndicator={false}
      />
    </TitleBackHeaderContainer>
  )
}

export default ProductListScreen

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 15
  },
  tab: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
    borderRadius: 60,
    borderColor: colors.chineseSilver,
    borderWidth: 1,
    alignItems: 'center'
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
    fontSize: fontSizes.regular
  },
  tabCountText: {
    fontSize: fontSizes.small,
    color: colors.label,
    textAlign: "center",
    justifyContent: "center"
  },
  activeTabCountText: {
    color: colors.label,
    fontSize: fontSizes.small
  },
  list: {
    // paddingHorizontal: 10,
    paddingBottom: 110
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
  }
})