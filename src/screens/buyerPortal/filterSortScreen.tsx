import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';
import Button from '../../components/button/buttons';
import { height, width } from '../../utils/utils';
import IconsSvg from '../../assets/svg/iconsSvg';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { getCategoryDetail } from '../../utils/apiAction';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { ProductCategory } from '../../utils/types';
import { sortByList } from '../../utils/static';

type FilterSortScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.FilterSortScreen
>;

type Category =
  | 'Electronics'
  | 'Appliances'
  | 'Mobiles'
  | 'Smart Gadgets'
  | 'Beauty & Personal Care'
  | 'Toys, Baby, Books'
  | 'Food & Healthcare'
  | 'Auto Accessories'
  | 'Furniture'
  | 'Bikes & Scooters'
  | 'Home Services';

export type Sort = {
  id: string;
  name: string;
};

type PriceRange = {
  label: string;
  min: number;
  max: number;
};

const FilterSortScreen: React.FC<FilterSortScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    initialFilters = [],
    initialSort = null,
    initialPriceRange = null,
    onApplyFilters,
  } = route.params || {};
  const userData = useSelector((user: IRootState) => user.user.userData);
  const isLogged = userData ? true : false;
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(initialFilters);
  const { data: categoryData, refetch: refetchcategoryDetail } = useQuery({
    queryKey: ['getCategoryDetail'],
    queryFn: () => getCategoryDetail(),
    enabled: isLogged,
  });

  const activeCategories: ProductCategory[] = categoryData?.data?.category
    ?.filter((category: any) => category.status === 'active')
    ?.map((category: any) => ({
      id: category.id,
      name: category.name,
    })) ?? [];

  const [selectedSort, setSelectedSort] = useState<Sort | null>(() => {
    if (initialSort) {
      return initialSort;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'Category' | 'Sort By' | 'Price'>('Category');

  // Handle price range with proper type conversion
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(() => {
    if (initialPriceRange) {
      return {
        label: `$${initialPriceRange.min} - $${initialPriceRange.max}`,
        min: initialPriceRange.min,
        max: initialPriceRange.max
      };
    }
    return null;
  });

  const [minPrice, setMinPrice] = useState<number>(() => {
    return initialPriceRange?.min || 100;
  });

  const [maxPrice, setMaxPrice] = useState<number>(() => {
    return initialPriceRange?.max || 1000;
  });

  const priceRanges: PriceRange[] = [
    { label: 'All Prices', min: 0, max: 10000 },
    { label: 'Up to $10', min: 0, max: 10 },
    { label: '$20 - $40', min: 20, max: 40 },
    { label: '$40 - $60', min: 40, max: 60 },
    { label: '$60 - $80', min: 60, max: 80 },
    { label: '$60 - $100', min: 60, max: 100 },
    { label: '$100 - $150', min: 100, max: 150 },
    { label: '$150 - $200', min: 150, max: 200 },
    { label: '$200 - $300', min: 200, max: 300 },
    { label: '$300 - $500', min: 300, max: 500 },
  ];
  
  const toggleCategory = (category: ProductCategory) => {
    const exists = selectedCategories.find(c => c.id === category.id);
    if (exists) {
      setSelectedCategories(prev => prev.filter(c => c.id !== category.id));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };
  
  const toggleSort = (sortOption: Sort) => {
    setSelectedSort(prev => (prev?.id === sortOption.id ? null : sortOption));
  };
  
  const selectPriceRange = (range: PriceRange) => {
    setSelectedPriceRange(range);
    setMinPrice(range.min);
    setMaxPrice(range.max);
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSort(null);
    setSelectedPriceRange(null);
    setMinPrice(100);
    setMaxPrice(1000);
  };
  
  const applyFilters = () => {
    if (onApplyFilters) {
      const priceRangeToSend = selectedPriceRange ?
        { min: minPrice, max: maxPrice } :
        null;
      
      // Pass the full sort object, not just the id
      onApplyFilters(
        selectedCategories,
        selectedSort, // Pass the full object
        priceRangeToSend
      );
    }
    navigation.goBack();
  };
  
  const renderPriceSlider = () => {
    return (
      <View style={styles.sliderContainer}>
        <Text style={styles.priceTitle}>Price</Text>
        <Text style={styles.priceRange}>
          ${minPrice} - ${maxPrice}
        </Text>
        <View style={{ marginHorizontal: 10 }}>
          <MultiSlider
            values={[minPrice, maxPrice]}
            sliderLength={200}
            onValuesChange={values => {
              setMinPrice(values[0]);
              setMaxPrice(values[1]);
              setSelectedPriceRange({
                label: `$${values[0]} - $${values[1]}`,
                min: values[0],
                max: values[1]
              });
            }}
            min={0}
            max={5000}
            step={1}
            selectedStyle={{
              backgroundColor: colors.primary,
            }}
            unselectedStyle={{
              backgroundColor: "#ccc",
            }}
            markerStyle={{
              backgroundColor: colors.primary,
              height: 20,
              width: 20,
            }}
          />
        </View>
      </View>
    );
  };

  const renderPriceButtons = () => {
    return (
      <View style={styles.priceButtonsContainer}>
        {priceRanges.map((range, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.priceButton,
              selectedPriceRange?.label === range.label &&
              styles.selectedPriceButton,
              range.label === 'All Prices' && styles.allPricesButton,
            ]}
            onPress={() => selectPriceRange(range)}>
            <Text
              style={[
                styles.priceButtonText,
                selectedPriceRange?.label === range.label &&
                styles.selectedPriceButtonText,
                range.label === 'All Prices' && styles.allPricesButtonText,
              ]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <TitleBackHeaderContainer title="Filter & Sort" isBack isNormalHeader={false}>
      <View style={styles.body}>
        <View style={styles.sidebar}>
          {['Category', 'Sort By', 'Price'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as 'Category' | 'Sort By' | 'Price')}>
              <Text
                style={[
                  styles.sidebarText,
                  activeTab === tab && styles.activeSidebarText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.content}>
            {activeTab === 'Category' &&
              activeCategories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => toggleCategory(category)}
                >
                  <View style={styles.checkboxContainer}>
                    <IconsSvg
                      name={
                        selectedCategories.find(c => c.id === category.id)
                          ? 'checkBoxSelected'
                          : 'checkBox'
                      }
                    />
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}

            {activeTab === 'Sort By' &&
              sortByList.map(sortOption => (
                <TouchableOpacity
                  key={sortOption.id}
                  style={styles.categoryItem}
                  onPress={() => toggleSort(sortOption)}>
                  <View style={styles.checkboxContainer}>
                    <IconsSvg
                      name={
                        selectedSort?.id === sortOption.id
                          ? 'checkBoxSelected'
                          : 'checkBox'
                      }
                    />
                    <Text style={styles.categoryText}>{sortOption.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}

            {activeTab === 'Price' && (
              <View style={styles.priceContainer}>
                {renderPriceSlider()}
                {renderPriceButtons()}
              </View>
            )}
          </ScrollView>

          {/* Apply Button at the Bottom */}
          <Button
            style={styles.applyButton}
            title="Apply"
            onPress={applyFilters}
          />
        </View>
      </View>
    </TitleBackHeaderContainer>
  );
};

export default FilterSortScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  body: {
    flexDirection: 'row',
  },
  sidebar: {
    width: 160,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderTopRightRadius: 24,
    height: height + 50,
    justifyContent: 'space-between',
  },
  sidebarText: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#21252B',
    fontFamily: fonts.bold,
  },
  activeSidebarText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 'auto',
    bottom: 150,
    marginHorizontal: 10,
  },
  clearText: {
    color: colors.text3,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  contentContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryItem: {
    paddingVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: colors.text3,
    fontSize: 14,
    fontFamily: fonts.medium,
    marginLeft: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    paddingTop: 20,
  },
  applyButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 150,
  },
  priceContainer: {
    paddingTop: 10,
  },
  sliderContainer: {
    marginBottom: 30,
  },
  priceTitle: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: '#21252B',
    marginBottom: 10,
  },
  priceRange: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: 20,
  },
  sliderWrapper: {
    paddingHorizontal: 8,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    position: 'relative',
  },
  sliderActiveTrack: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    position: 'absolute',
    top: -6,
  },
  priceButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  priceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPriceButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  allPricesButton: {
    backgroundColor: '#21252B',
    borderColor: '#21252B',
  },
  priceButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.label,
  },
  selectedPriceButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  allPricesButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.medium,
  },
});