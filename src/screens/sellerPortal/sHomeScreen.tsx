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
  const renderTab = ({ item }: { item: string }) => (
    <TouchableOpacity
      key={item}
      onPress={() => setSelectedTab(item)}
      style={[
        styles.tab,
        selectedTab === item && styles.activeTab,
      ]}
    >
      <Text style={[styles.tabText, selectedTab === item && styles.activeTabText]}>{item}</Text>
    </TouchableOpacity>
  );
  return (
    <HeaderHomeContainer
      title={'Welcome,'}
      userName={"Hello John"}
      isHome
      onSearchPress={() => { }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={dashboardAnalyticsData}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          // contentContainerStyle={styles.container}
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
      </ScrollView>
    </HeaderHomeContainer>

  )
}

export default SHomeScreen

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 16,
    borderRadius: 60,
    borderColor: colors.chineseSilver,
    borderWidth: 1
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
  list: {
    paddingBottom: 100, // To add some space at the bottom
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  cardPosted: {
    fontSize: 12,
    color: '#888',
  },
  viewDetailsBtn: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  viewDetailsText: {
    color: 'white',
    fontSize: 14,
  },
})