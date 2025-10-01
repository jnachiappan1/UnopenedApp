// components/DashboardCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import IconsSvg, { IconName } from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';

interface BannerItemCardProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  value?: string;
  onSubmit?: () => void;
  hasActiveFilters?: boolean;
}

const SearchBar: React.FC<BannerItemCardProps> = ({ placeholder = 'Search unopened products...',
  onChangeText,
  onFilterPress,
  onSubmit,
  value,
  hasActiveFilters = false, }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#666"
        onChangeText={onChangeText}
        value={value}
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <IconsSvg name ="filterIcon"/>
        {hasActiveFilters && <View style={styles.redDot} />}
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
  },
  filterButton: {
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
  filterText: {
    fontSize: 16,
  },
});
