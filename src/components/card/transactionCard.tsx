import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
        showBoth: false,
        description: 'Product purchase transaction'
      };
    case 'wallet_buy_product_funds':
      return {
        displayAmount: amount,
        label: 'Purchase (Wallet + Card)',
        showBoth: true,
        walletAmount: wallet_amount,
        description: 'Product purchase paid with wallet and external payment'
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
  const [expanded, setExpanded] = useState<boolean>(false);

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

  const breakdown = useMemo(() => {
    const total = Number(item?.amount) || 0;
    const walletAmt = Number(item?.wallet_amount) || 0;
    const externalAmt = Math.max(total - walletAmt, 0);
    const hasWallet = walletAmt > 0 || ['wallet_funds', 'add_funds'].includes(item?.payment_transaction_type);
    const shouldShow = hasWallet || externalAmt > 0;
    const externalLabel = item?.payment_type || item?.method || 'Stripe Card';
    const externalMasked = item?.meta?.card_last4 ? `**** **** **** ${item?.meta?.card_last4}` : '';

    return { shouldShow, walletAmt, externalAmt, externalLabel, externalMasked, total };
  }, [item]);

  return (
    <View style={[styles.card, expanded && styles.cardExpanded]}>
      {/* Main transaction row */}
      <View style={styles.mainRow}>
        <View style={styles.left}>
          <View style={styles.iconCircle}>
            <IconsSvg name={iconName as IconName} width={20} height={20} />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.title}>{item.purpose || 'Transaction'}</Text>
            <View style={styles.dateRow}>
              <IconsSvg name={'celender'} width={16} height={16} />
              <Text style={styles.subtitle}>
                {formatDate(item.createdAt)}
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
          <Text style={[styles.amount, { color: amountColor }]}>
            {prefix}${formatAmount(transactionInfo.displayAmount)}
          </Text>
          {breakdown.shouldShow && (
            <TouchableOpacity onPress={() => setExpanded((e) => !e)} style={styles.expandButton}>
              <IconsSvg name={expanded ? 'arrowUp' : 'downArrow'} width={16} height={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Expanded payment breakdown */}
      {expanded && breakdown.shouldShow && (
        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
          </View>
          
          {/* Wallet payment row */}
          {breakdown.walletAmt > 0 || ['wallet_funds', 'add_funds'].includes(item?.payment_transaction_type) ? (
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={styles.breakdownIcon}>
                  <IconsSvg name={'walletIcon'} width={16} height={16} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Wallet</Text>
                  <Text style={styles.breakdownSubLabel}>Wallet Balance</Text>
                </View>
              </View>
              <Text style={styles.breakdownAmount}>${formatAmount(String(breakdown.walletAmt || 0))}</Text>
            </View>
          ) : null}

          {/* External payment row */}
          {breakdown.externalAmt > 0 ? (
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={styles.breakdownIcon}>
                  <IconsSvg name={'addCard'} width={16} height={16} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>{breakdown.externalLabel}</Text>
                  {breakdown.externalMasked ? (
                    <Text style={styles.breakdownSubLabel}>{breakdown.externalMasked}</Text>
                  ) : null}
                </View>
              </View>
              <Text style={styles.breakdownAmount}>${formatAmount(String(breakdown.externalAmt || 0))}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  cardExpanded: {
    paddingBottom: 16,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#333333',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.label,
    marginLeft: 6,
  },
  transactionType: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.primary,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amount: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    marginBottom: 6,
  },
  expandButton: {
    padding: 4,
  },
  breakdownContainer: {
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    marginTop: 16,
    overflow: 'hidden',
  },
  breakdownHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  breakdownTitle: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#333333',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // elevation: 2,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  breakdownTextContainer: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    color: '#333333',
    marginBottom: 2,
  },
  breakdownSubLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.label,
  },
  breakdownAmount: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#333333',
  },
});
