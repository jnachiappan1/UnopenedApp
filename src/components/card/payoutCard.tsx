import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconsSvg from '../../assets/svg/iconsSvg';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';

type PayoutStatus = 'Success' | 'Pending' | 'Failed';

export type PayoutItem = {
  id: string | number;
  title?: string;
  dateTime?: string;
  amount: number | string;
  status: PayoutStatus;
  // API response fields
  created_at?: string;
  amount_requested?: string | number;
  status_api?: string;
  bank_details?: any;
  // New API response fields
  purpose?: string;
  createdAt?: string;
  transactionType?: string;
  currency?: string;
  notes?: string;
};

type Props = {
  item: PayoutItem;
};

const PayoutCard: React.FC<Props> = ({ item }) => {
  // Map API status to display status
  const mapApiStatusToDisplay = (apiStatus: string | undefined): PayoutStatus => {
    if (!apiStatus) return 'Pending';
    
    const status = apiStatus.toLowerCase();
    if (status.includes('success') || status.includes('completed')) return 'Success';
    if (status.includes('failed') || status.includes('rejected')) return 'Failed';
    if (status.includes('pending') || status.includes('processing')) return 'Pending';
    
    return 'Pending';
  };

  // Format date to readable format
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get display values from API data or fallback to static data
  const displayAmount = item.amount || item.amount_requested;
  const displayDate = formatDate(item.createdAt || item.created_at);
  const displayStatus = mapApiStatusToDisplay(item.status);
  const displayTitle = item.purpose || item.title || 'Cash Out';

  const getStatusStyle = (status: PayoutStatus) => {
    switch (status) {
      case 'Success':
        return { backgroundColor: '#E6F5EC', color: '#2DB057' };
      case 'Pending':
        return { backgroundColor: '#FEE9CB', color: '#E29547' };
      case 'Failed':
        return { backgroundColor: '#FEE2E2', color: '#D93B3B' };
      default:
        return { backgroundColor: '#EEE', color: '#666' };
    }
  };

  const { backgroundColor, color } = getStatusStyle(displayStatus);

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{displayTitle}</Text>
        <View style={[styles.statusBadge, { backgroundColor }]}>
          <Text style={[styles.statusText, { color }]}>{displayStatus}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.dateRow}>
          <IconsSvg name="celender" width={16} height={16} />
          <Text style={styles.dateText}>{displayDate}</Text>
        </View>
        <Text style={styles.amount}>
          {item.currency ? item.currency.toUpperCase() : '$'}{displayAmount}
        </Text>
      </View>
    </View>
  );
};

export default PayoutCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.medium,
    color: colors.text2,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    marginLeft: 6,
    fontSize: fontSizes.small,
    color: colors.label,
    fontFamily: fonts.regular,
  },
  amount: {
    marginTop: 8,
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#1F1F1F',
    alignSelf: 'flex-end',
    paddingEnd: 2
  },
});
