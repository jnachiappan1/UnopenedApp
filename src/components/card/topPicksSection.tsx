import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';

const {width} = Dimensions.get('window');

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface Props {
  title?: string;
  products: Product[];
  onViewAll?: () => void;
}

const TopPicksSection: React.FC<Props> = ({
  title = 'Top Picks in Electronics',
  products,
  onViewAll,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal List */}
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{width: 10}} />}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.topPickCard}>
            <Image source={{uri: item.image}} style={styles.topPickImage} />
            <Text style={styles.topPickName}>{item.name}</Text>
            <Text style={styles.topPickPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TopPicksSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#1A1A1A",
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  listContent: {
    paddingRight: 16,
  },
  topPickCard: {
    width: 140,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
  },
  topPickImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  topPickName: {
    color: colors.primaryBlack,
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  topPickPrice: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});
