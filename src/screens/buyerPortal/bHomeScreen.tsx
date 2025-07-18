import {
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {bannerData, products, recentItems, topPicks} from '../../utils/static';
import BannerItem from '../../components/card/bannerItem';
import SearchBar from '../../components/card/searchBar';
import CategoryList from '../../components/card/categoryList';
import ProductSection from '../../components/card/productSection';
import TopPicksSection from '../../components/card/topPicksSection';

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.BHomeScreen
>;

const BHomeScreen: React.FC<LoginProps> = ({route, navigation}) => {
  const categories = ['Mobile', 'Earphones', 'Smartwatch', 'Watch'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleFilterPress = () => {
    console.log('Filter button pressed');
  };
  return (
    <HeaderHomeContainer
      title={'Welcome,'}
      userName={'Hello John'}
      isHome
      onSearchPress={() => {}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <FlatList
          data={bannerData}
          keyExtractor={item => item.id}
          renderItem={({item}) => <BannerItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={handleFilterPress}
        />

        <CategoryList
          categories={categories}
          selectedIndex={selectedIndex}
          onSelectCategory={setSelectedIndex}
        />

        <ProductSection
          title="Our Products"
          products={products}
          onViewAll={() => console.log('View All Pressed')}
        />

        <TopPicksSection
          title="Top Picks in Electronics"
          products={topPicks}
          onViewAll={() => console.log('View All Top Picks')}
        />

        <ProductSection
          title="Recently Listed Items"
          products={recentItems}
          onViewAll={() => console.log('View All Pressed')}
        />
      </ScrollView>
    </HeaderHomeContainer>
  );
};

export default BHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
