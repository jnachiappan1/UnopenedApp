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
  wallet_amount: string
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
  paid_on: string
  payment_transaction_type: string
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

const getTransactionDisplayInfo = (item: TransactionType) => {
  const { payment_transaction_type, amount, wallet_amount, transactionType } = item;
  
  switch (payment_transaction_type) {
    case 'wallet_funds':
      return {
        displayAmount: wallet_amount,
        label: 'Wallet Funds',
        showBoth: false,
        description: 'Wallet transaction'
      };
    case 'add_funds':
      return {
        displayAmount: wallet_amount,
        label: 'Added Funds',
        showBoth: false,
        description: 'Funds added to wallet'
      };
    case 'buy_product':
      return {
        displayAmount: amount,
        label: 'Product Purchase',
        showBoth: true,
        walletAmount: wallet_amount,
        description: 'Product purchase transaction'
      };
    default:
      return {
        displayAmount: amount,
        label: 'Transaction',
        showBoth: false,
        description: 'General transaction'
      };
  }
};

const TransactionCard: React.FC<Props> = ({ item }) => {
  const { amountColor, prefix, iconName } = getTypeStyles(item.transactionType);
  const transactionInfo = getTransactionDisplayInfo(item);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const formatAmount = (amount: string) => {
    const numAmount = Math.abs(Number(amount));
    return numAmount.toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return '#38C36D';
      case 'pending':
        return '#FFA500';
      case 'failed':
        return '#D00000';
      default:
        return colors.label;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <IconsSvg name={iconName as IconName} width={20} height={20} />
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.title}>{item.purpose || 'Transaction'}</Text>
          <View style={{flexDirection:'row',paddingVertical:5}}>
            <IconsSvg name={'celender'} width={20} height={20} />
            <Text style={styles.subtitle}>
              {item.notes || formatDate(item.createdAt)}
            </Text>
          </View>
          {transactionInfo.label && (
            <Text style={styles.transactionType}>
              {transactionInfo.label}
            </Text>
          )}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.amountContainer}>
        {transactionInfo.showBoth ? (
          <>
            <Text style={[styles.amount, { color: amountColor }]}>
              {prefix}${formatAmount(transactionInfo.displayAmount)}
            </Text>
            <Text style={styles.walletAmount}>
              Wallet: ${formatAmount(transactionInfo.walletAmount || '0')}
            </Text>
          </>
        ) : (
          <Text style={[styles.amount, { color: amountColor }]}>
            {prefix}${formatAmount(transactionInfo.displayAmount)}
          </Text>
        )}
      </View>
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
    flex: 1,
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
  transactionType: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.primary,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
  },
  walletAmount: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.label,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
  },
});
