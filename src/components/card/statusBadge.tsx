import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';

type StatusBadgeProps = {
  status?: string;
  statusStyle?: StyleProp<ViewStyle> | undefined;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, statusStyle }) => {
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'in_review':
        return {
          backgroundColor: '#FBF0DB',
          textColor: '#AF7E15',
          displayText: 'In Review'
        };
      case 'sold':
        return {
          backgroundColor: '#F3E4E2',
          textColor: '#CB1C1C',
          displayText: 'Sold'
        };
      case 'active':
        return {
          backgroundColor: '#DBF5E2',
          textColor: '#239C43',
          displayText: 'Active'
        };
      case 'Delivered':
        return {
          backgroundColor: '#DBF5E2',
          textColor: '#239C43',
          displayText: 'Delivered'
        };
      case 'Pending':
        return {
          backgroundColor: '#F3E4E2',
          textColor: '#CB1C1C',
          displayText: 'Pending'
        };
      case 'In Transit':
        return {
          backgroundColor: '#FBF0DB',
          textColor: '#AF7E15',
          displayText: 'In Transit'
        };
      default:
        return {
          backgroundColor: '#F0F0F0',
          textColor: '#000000',
          displayText: status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Unknown'
        };
    }
  };

  const { backgroundColor, textColor, displayText } = getStatusStyle(status);

  return (
    <View style={[styles.statusContainer, statusStyle, { backgroundColor }]}>
      <Text style={[styles.statusText, { color: textColor }]}>
        {displayText}
      </Text>
    </View>
  );
};

export default StatusBadge;

const styles = StyleSheet.create({
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 18,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold
  },
});