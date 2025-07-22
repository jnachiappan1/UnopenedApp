import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';

type StatusBadgeProps = {
  status?: string;
  statusStyle?: StyleProp<ViewStyle> | undefined;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status,statusStyle }) => {
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'In Review':
        return {
          backgroundColor: '#FBF0DB',
          textColor: '#AF7E15',
        };
      case 'Sold':
        return {
          backgroundColor: '#F3E4E2',
          textColor: '#CB1C1C',
        };
      case 'Active':
        return {
          backgroundColor: '#DBF5E2',
          textColor: '#239C43',
        };
      case 'Delivered':
        return {
          backgroundColor: '#DBF5E2',
          textColor: '#239C43',
        };
        case 'Pending':
        return {
          backgroundColor: '#F3E4E2',
          textColor: '#CB1C1C',
        };
        case 'In Transit':
          return {
            backgroundColor: '#FBF0DB',
            textColor: '#AF7E15',
          };
      default:
        return {
          backgroundColor: '#F0F0F0',
          textColor: '#000000',
        };
    }
  };

  const { backgroundColor, textColor } = getStatusStyle(status);

  return (
    <View style={[styles.statusContainer,statusStyle, { backgroundColor }]}>
      <Text style={[styles.statusText, { color: textColor }]}>
        {status}
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
    fontFamily:fonts.bold
  },
});
