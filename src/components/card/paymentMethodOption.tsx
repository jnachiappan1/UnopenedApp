import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IconsSvg, { IconName } from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';

type PaymentMethodOptionProps = {
  title: string;
  icon: IconName;
  onPress: (item: { title: string; icon: IconName }) => void;
  selected?: boolean;
};

const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({
  title,
  icon,
  onPress,
  selected,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && { borderColor: colors.primary, borderWidth: 2 }]}
      onPress={() => onPress({ title, icon })}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          <IconsSvg name={icon} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

export default PaymentMethodOption;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F4F7F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: '#1C1C1E',
  },
  arrow: {
    fontSize: 18,
    color: '#888',
    marginRight: 4,
  },
});
