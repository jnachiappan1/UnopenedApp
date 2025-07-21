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
}

const SearchBar: React.FC<BannerItemCardProps> = ({ placeholder = 'Search unopened products...',
  onChangeText,
  onFilterPress,
  value, }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#666"
        onChangeText={onChangeText}
        value={value}
      />
      <TouchableOpacity  onPress={onFilterPress}>
        <IconsSvg name ="filterIcon"/>
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
  
  filterText: {
    fontSize: 16,
  },
});
