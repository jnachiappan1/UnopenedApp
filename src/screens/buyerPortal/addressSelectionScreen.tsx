import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getAddresses} from '../../utils/apiAction';
import {AddressType} from '../../utils/types';
import {showAlert} from '../../components/cAlert';
import {useSelector} from 'react-redux';
import {IRootState} from '../../redux/store';

type AddressSelectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddressSelectionScreen
>;

const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({
  navigation,
  route,
}) => {
  const {onAddressSelect, selectedAddressId} = route.params;

  const {
    data: addressesData,
    isLoading,
    refetch,
    error,
  } = useQuery({
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

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const addresses = addressesData?.data?.address || [];

  const allAddresses = React.useMemo(() => {
    if (addresses && addresses.length > 0) {
      const addressesWithDefault = addresses.map((address: AddressType) => ({
        ...address,
        isDefault: selectedAddressId ? address.id === selectedAddressId : false,
      }));
      return addressesWithDefault;
    }
    return [];
  }, [addresses, selectedAddressId]);

  const handleAddressSelect = (address: AddressType) => {
    onAddressSelect(address);
    navigation.goBack();
  };

  const handleAddNewAddress = () => {
    navigation.navigate(SCREENS.AddAddressScreen);
  };

  const renderAddressItem = ({
    item,
  }: {
    item: AddressType & {isDefault?: boolean};
  }) => {
    const isDefaultAddress = item.isDefault;

    return (
      <TouchableOpacity
        style={[
          styles.addressCard,
          isDefaultAddress && styles.defaultAddressCard,
        ]}
        onPress={() => handleAddressSelect(item)}>
        <View style={styles.addressHeader}>
          <View style={styles.addressHeaderLeft}>
            <Text style={styles.addressName}>{item.full_name}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate(SCREENS.EditAddressScreen, {
                  addressId: item.id,
                  mode: 'edit',
                })
              }>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressHeaderRight}>
            {isDefaultAddress && (
              <View style={styles.defaultAddressBadge}>
                <Text style={styles.defaultAddressBadgeText}>Default</Text>
              </View>
            )}
            <Text style={styles.addressPhone}>
              {item.country_code} {item.phone_number}
            </Text>
          </View>
        </View>
        <Text style={styles.addressText}>{item.address}</Text>
        <Text style={styles.addressLocation}>
          {item.city}, {item.state}, {item.country}
          {item.pincode ? ` - ${item.pincode}` : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Addresses Found</Text>
      <Text style={styles.emptySubtitle}>
        You haven't added any addresses yet. Add your first address to get
        started.
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
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={renderEmptyState}
            />

            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddNewAddress}>
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
  addressHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressHeaderRight: {
    alignItems: 'flex-end',
  },
  defaultAddressCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  defaultAddressBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  defaultAddressBadgeText: {
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
  editButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  editButtonText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.primary,
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
