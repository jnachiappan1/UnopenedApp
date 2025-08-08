import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAddresses } from '../../utils/apiAction';
import { AddressType, IUser } from '../../utils/types';
import { showLoader } from '../../components/loader/loader';
import { showAlert } from '../../components/cAlert';
import IconsSvg from '../../assets/svg/iconsSvg';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';

type AddressSelectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddressSelectionScreen
>;

const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { onAddressSelect } = route.params;
  const queryClient = useQueryClient();
  const userData = useSelector((user: IRootState) => user.user.userData);

  const { data: addressesData, isLoading, refetch, error } = useQuery({
    queryKey: ['getAddresses'],
    queryFn: getAddresses,
  });
  React.useEffect(() => {
    if (error) {
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error',
        description: 'Failed to load addresses. Please try again.',
        doneText: 'Okay',
      });
    }
  }, [error]);

  // Refresh addresses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const addresses = addressesData?.data?.address || [];
console.log(userData,"userData---");

  // Convert user data to address format if user has address information
  const getUserAddress = (): AddressType | null => {
    if (!userData || !userData.address) return null;
    
    return {
      id: -1, // Use negative ID to distinguish from saved addresses
      full_name: `${userData.full_name || ''}`.trim(),
      phone_number: userData.phone_number || '',
      address: userData.address || '',
      country: userData.country || '',
      state: userData.state || '',
      city: userData.city || '',
      pincode: userData.pincode,
      country_code: userData.country_code || '',
      created_at: userData.createdAt || '',
      updated_at: userData.updatedAt || '',
    };
  };

  // Combine user address with saved addresses
  const allAddresses = React.useMemo(() => {
    const userAddress = getUserAddress();
    if (userAddress) {
      return [userAddress, ...addresses];
    }
    return addresses;
  }, [userData, addresses]);

  const handleAddressSelect = (address: AddressType) => {
    onAddressSelect(address);
    navigation.goBack();
  };

  const handleAddNewAddress = () => {
    navigation.navigate(SCREENS.AddAddressScreen);
  };

  const renderAddressItem = ({ item }: { item: AddressType }) => {
    const isUserAddress = item.id === -1;
    
    return (
      <TouchableOpacity
        style={[
          styles.addressCard,
          isUserAddress && styles.userAddressCard
        ]}
        onPress={() => handleAddressSelect(item)}
      >
        <View style={styles.addressHeader}>
          <Text style={styles.addressName}>{item.full_name}</Text>
          <View style={styles.addressHeaderRight}>
            {isUserAddress && (
              <View style={styles.userAddressBadge}>
                <Text style={styles.userAddressBadgeText}>My Address</Text>
              </View>
            )}
            <Text style={styles.addressPhone}>
              {item.country_code} {item.phone_number}
            </Text>
          </View>
        </View>
        <Text style={styles.addressText}>{item.address}</Text>
        <Text style={styles.addressLocation}>
          {item.city}, {item.state}, {item.country}{item.pincode ? ` - ${item.pincode}` : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Addresses Found</Text>
      <Text style={styles.emptySubtitle}>
        You haven't added any addresses yet. Add your first address to get started.
      </Text>
    </View>
  );

  return (
    <TitleBackHeaderContainer title="Select Address" isBack>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading addresses...</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={allAddresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={renderEmptyState}
            />
            
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddNewAddress}
              >
                <Text style={styles.addButtonText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </TitleBackHeaderContainer>
  );
};

export default AddressSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressHeaderRight: {
    alignItems: 'flex-end',
  },
  userAddressCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  userAddressBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  userAddressBadgeText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  addressName: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.title,
  },
  addressPhone: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.text3,
  },
  addressText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text2,
    marginBottom: 4,
    lineHeight: 20,
  },
  addressLocation: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.text3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.title,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.regular,
    color: colors.text3,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    color: colors.text3,
  },
}); 