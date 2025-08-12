import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';

interface CategoryItem {
  id: number;
  name: string;
}

interface CategoryListProps {
  categories: CategoryItem[];
  selectedCategoryId: number | null; 
  onSelectCategory: (categoryId: number | null, categoryName: string | null) => void;
  onSeeMorePress: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onSeeMorePress,
}) => {
  
  const handleCategoryPress = (item: CategoryItem) => {
    // If the clicked item is already selected, deselect it
    if (item.id === selectedCategoryId) {
      onSelectCategory(null, null);
    } else {
      // Otherwise, select the new item
      onSelectCategory(item.id, item.name);
    }
  };

  // Show only first 5 categories and add "See More" as the last item
  const displayedCategories = categories.slice(0, 5);
  const hasMoreCategories = categories.length > 5;

  // Create the data array with categories and "See More" button
  const listData = hasMoreCategories 
    ? [...displayedCategories, { id: -999, name: 'See More' }]
    : displayedCategories;

  const renderItem = ({ item }: { item: CategoryItem }) => {
    // Check if this is the "See More" item
    if (item.id === -999) {
      return (
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={onSeeMorePress}
        >
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          item.id === selectedCategoryId && styles.activeCategoryButton,
        ]}
        onPress={() => handleCategoryPress(item)}>
        <Text
          style={[
            styles.categoryText,
            item.id === selectedCategoryId && styles.activeCategoryText,
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      data={listData}
      keyExtractor={(item) => item.id === -999 ? 'see-more' : item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
      renderItem={renderItem}
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
    borderWidth: 1,
    borderColor: colors.border || '#E0E0E0',
    justifyContent:'center'
    
  },
  activeCategoryButton: {
    backgroundColor: colors.black,
    borderColor: colors.black,
    
  },
  categoryText: {
    color: colors.label,
    fontSize: 14,
    fontFamily: fonts.bold,
    textTransform:'capitalize',
    textAlign:'center'

  },
  activeCategoryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bold,
    textAlign:'center'
  },
  seeMoreButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
  },
  seeMoreText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
});