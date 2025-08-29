import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';

interface BankDetails {
  id: number;
  user: number;
  first_name: string;
  last_name: string;
  dob: {
    day: string;
    year: string;
    month: string;
  };
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  ssn_last_4: string;
  holder_name: string;
  account_number: string;
  bank_name: string;
  routing_number: string;
  stripe_bank_account_id: string;
  verified: boolean | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface BankDetailsCardProps {
  bankDetails: BankDetails;
}

const BankDetailsCard: React.FC<BankDetailsCardProps> = ({ bankDetails }) => {
  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  const maskRoutingNumber = (routingNumber: string) => {
    if (routingNumber.length <= 4) return routingNumber;
    return `****${routingNumber.slice(-4)}`;
  };

    return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Account Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Account Holder:</Text>
          <Text style={styles.value}>{bankDetails.holder_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Bank Name:</Text>
          <Text style={styles.value}>{bankDetails.bank_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Routing Number:</Text>
          <Text style={styles.value}>{maskRoutingNumber(bankDetails.routing_number)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account Number:</Text>
          <Text style={styles.value}>{maskAccountNumber(bankDetails.account_number)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{bankDetails.status || 'Pending'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Verified:</Text>
          <Text style={styles.value}>{bankDetails.verified ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </View>
  );
  };

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  title: {
    fontSize: fontSizes.extraLarge,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text,
    flex: 1,
  },
  value: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.regular,
    color: colors.primaryBlack,
    flex: 2,
    textAlign: 'right',
  },

});

export default BankDetailsCard;
