// components/DashboardCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import IconsSvg, {IconName} from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';

interface BannerItemCardProps {
  categories: string[];
  selectedIndex: number;
  onSelectCategory: (index: number) => void;
}

const CategoryList: React.FC<BannerItemCardProps> = ({
  categories,
  selectedIndex,
  onSelectCategory,
}) => {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
      renderItem={({item, index}) => (
        <TouchableOpacity
          style={[
            styles.categoryButton,
            index === selectedIndex && styles.activeCategoryButton,
          ]}
          onPress={() => onSelectCategory(index)}>
          <Text
            style={[
              styles.categoryText,
              index === selectedIndex && styles.activeCategoryText,
            ]}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: colors.black,
  },
  categoryText: {
    color: colors.label,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  activeCategoryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});
