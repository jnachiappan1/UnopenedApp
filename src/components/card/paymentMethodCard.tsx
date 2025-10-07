import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';
import IconsSvg, { IconName } from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';

export type PaymentMethodType = {
  id: number;
  title: string;
  subtitle?: string;
  icon: IconName;
};

type PaymentMethodCardProps = {
  item: PaymentMethodType;
  selected: boolean;
  onPress: (item: PaymentMethodType) => void;
};

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  item,
  selected,
  onPress,
}) => {

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        selected && styles.selectedCard
      ]} 
      onPress={() => {
        onPress(item);
      }} 
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <IconsSvg name={item.icon} />
        </View>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
        </View>
      </View>

      <View style={[
        styles.radio,
        selected && styles.radioSelected // Apply selected radio style
      ]}>
        {selected && <View style={styles.innerDot} />}
      </View>
    </TouchableOpacity>
  );
};

export default PaymentMethodCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: colors.white,
  },
  selectedCard: {
    borderColor: colors.primary, // Change border color when selected
    backgroundColor: colors.primary + '10', // Add subtle background tint (10% opacity)
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F2F5ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  title: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.text2,
  },
  subtitle: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.label,
    marginTop: 2,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.white, 
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});