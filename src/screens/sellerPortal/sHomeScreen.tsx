import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer'
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { dashboardAnalyticsData, productData } from '../../utils/static';
import DashboardAnalyticsCard from '../../components/card/dashboardAnalyticsCard';
import { IconName } from '../../assets/svg/iconsSvg';
import ProductListingCard from '../../components/card/productListingCard';
import { fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';

type PHomeScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.SHomeScreen>;

const SHomeScreen: React.FC<PHomeScreenProps> = ({ navigation }) => {
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
  return (
    <HeaderHomeContainer
      title={'Welcome,'}
      userName={"Hello John"}
      isHome
      onSearchPress={() => { }}
    >
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <FlatList
          data={dashboardAnalyticsData}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
           contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <DashboardAnalyticsCard
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon as IconName}
            />
          )}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>My Listing</Text>
            <Text style={styles.viewAllText}>View All</Text>
          </View>
          <FlatList
            data={['All', 'Active', 'Sold', 'In Review']}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderTab}
            keyExtractor={(item) => item}
            style={styles.tabs}
          />
          <FlatList
            data={filterData()}
            renderItem={({ item }) => (
              <ProductListingCard
                item={item}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </View>
        <View style={{marginBottom:100}}>
           <View style={styles.header}>
            <Text style={styles.title}>Recently Added Products</Text>
            <Text style={styles.viewAllText}>View All</Text>
          </View>
          <FlatList
            data={filterData()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductListingCard
                item={item}
                cardStyle={{marginHorizontal:5}}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{paddingVertical:10,paddingHorizontal:10}}
          />
        </View>
      {/* </ScrollView> */}
    </HeaderHomeContainer>
  )
}

export default SHomeScreen

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    // paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  title: {
    fontSize: fontSizes.large,
    fontWeight: '600',
  },
  viewAllText: {
    color: colors.primary,
    fontSize: fontSizes.regular,
  },
  tabs: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal:15
  },
  tab: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 16,
    borderRadius: 60,
    borderColor: colors.chineseSilver,
    borderWidth: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.black,
    borderRadius: 60
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
  },
  activeTabCountText: {
    color: colors.label,
    fontSize: fontSizes.small
  },
  list: {
     paddingHorizontal: 15,
  },
  countContainer: {
    backgroundColor: '#E7ECDF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginStart: 5
  }
})