// components/DashboardCard.tsx
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import IconsSvg, {IconName} from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import IMAGE from '../../assets/images';

interface BannerItemCardProps {
  item: {
    titleLines: string[];
    subtitleLines: string[];
    icon: any;
  };
}

const BannerItem: React.FC<BannerItemCardProps> = ({item}) => {
  return (
    <View style={styles.banner}>
      <View style={styles.bannerContent}>
        {item.titleLines.map((line: string, index: number) => (
          <Text key={`title-${index}`} style={styles.bannerTitle}>
            {line}
          </Text>
        ))}
        {item.subtitleLines.map((line: string, index: number) => (
          <Text key={`subtitle-${index}`} style={styles.bannerSubtitle}>
            {line}
          </Text>
        ))}
      </View>
      <Image
        source={IMAGE.boxImage}
        style={styles.imageStyle}
        resizeMode="contain"
      />
    </View>
  );
};

export default BannerItem;

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
    height:140
  },
  bannerContent: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.medium,
    marginTop: 4,
  },
  imageStyle: {
    height: 93,
    width: 119,
  },
});
