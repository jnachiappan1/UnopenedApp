import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import IconsSvg, { IconName } from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
export type TransactionTypeName = 'credit' | 'debit' | 'add';

export type TransactionType = {
  id: number
  user: number
  transactionType: string
  amount: string
  currency: string
  transactionId: any
  status: string
  purpose: string
  type: string
  tx_ref: string
  flw_ref: any
  device_fingerprint: any
  charged_amount: any
  app_fee: any
  merchant_fee: any
  processor_response: any
  auth_model: any
  ip: any
  narration: any
  payment_type: any
  account_id: any
  meta: any
  amount_settled: any
  customer: any
  currentWalletbalance: any
  method: string
  category: any
  notes: string
  createdAt: string
  updatedAt: string
};

type Props = {
  item: TransactionType;
};

const getTypeStyles = (rawType: string) => {
  let type: TransactionTypeName;

  switch (rawType.toLowerCase()) {
    case 'credit':
    case 'sold':
    case 'refund':
      type = 'credit';
      break;
    case 'debit':
    case 'withdrawal':
      type = 'debit';
      break;
    case 'add':
    case 'added funds':
      type = 'add';
      break;
    default:
      type = 'credit';
  }

  const iconName = (() => {
    switch (type) {
      case 'credit':
        return 'arrowUpIcon';
      case 'debit':
        return 'arrowDownIcon';
      case 'add':
        return 'addIcon';
    }
  })();

  const amountColor =
    type === 'debit' ? '#D00000' : '#38C36D';
  const prefix = type === 'debit' ? '-' : '+';

  return { amountColor, prefix, iconName };
};

const TransactionCard: React.FC<Props> = ({ item }) => {
  const { amountColor, prefix, iconName } = getTypeStyles(item.transactionType);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <IconsSvg name={iconName as IconName} width={20} height={20} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{item.purpose}</Text>
          <View style={{flexDirection:'row',paddingVertical:5}}>
            <IconsSvg name={'celender'} width={20} height={20} />
            <Text style={styles.subtitle}>
              {item.notes || formatDate(item.createdAt)}
            </Text>
          </View>

        </View>
      </View>

      <Text style={[styles.amount, { color: amountColor }]}>
      {prefix}${Math.abs(Number(item.amount))}
      </Text>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    // elevation: 2,
    marginHorizontal: 15
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#333333',
  },
  subtitle: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.label,
    marginTop: 2,
    paddingStart:5
  },
  amount: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
  },
});
