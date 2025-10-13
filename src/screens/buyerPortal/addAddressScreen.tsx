import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import InputCountry from '../../components/input/inputCountry';
import InputState from '../../components/input/inputState';
import InputCity from '../../components/input/inputCity';
import PhoneNumberInputs from '../../components/input/phoneNumberInputs';
import Button from '../../components/button/buttons';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { selectedCountryType } from '../../utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAddress } from '../../utils/apiAction';
import { AddressPayloadType } from '../../utils/types';
import { showLoader } from '../../components/loader/loader';
import { showAlert } from '../../components/cAlert';

type AddAddressProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddAddressScreen
>;

interface AddressFormData {
  fullName: string;
  phone_number: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  addressType: string;
  isDefault: boolean;
  country_code: string;
}

const AddAddressScreen: React.FC<AddAddressProps> = ({ navigation }) => {
  const userData = useSelector((user: IRootState) => user.user.userData);
  const queryClient = useQueryClient();
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCountry, setPhoneCountry] = useState<selectedCountryType>({
    callingCode: ['1'],
    cca2: 'US',
    currency: ['USD'],
    flag: 'flag-us',
    name: 'United States',
    region: 'Americas',
    subregion: 'North America',
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: '',
      phone_number: '',
      address: '',
      country: 'US',
      state: '',
      city: '',
      zipCode: '',
      addressType: 'Home',
      isDefault: false,
      country_code: '+1',
    },
  });

  const watchedCountry = watch('country');
  const watchedState = watch('state');

  // Clear state and city when country changes
  useEffect(() => {
    if (watchedCountry) {
      setValue('state', '');
      setValue('city', '');
    }
  }, [watchedCountry, setValue]);

  // Clear city when state changes
  useEffect(() => {
    if (watchedState) {
      setValue('city', '');
    }
  }, [watchedState, setValue]);

  const { mutate } = useMutation({
    mutationFn: addAddress,
    onSuccess: (data) => {
      showLoader(false);
      // Invalidate and refetch addresses
      queryClient.invalidateQueries({ queryKey: ['getAddresses'] });
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Address Added',
        description: 'Your address has been added successfully.',
        doneText: 'Okay',
        onDonePress: () => {
          navigation.goBack();
        },
      });
    },
    onError: (error) => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error',
        description: 'Failed to add address. Please try again.',
        doneText: 'Okay',
      });
    },
  });

  const onSubmit = (data: AddressFormData) => {
    showLoader(true);
  
    const payload: AddressPayloadType = {
      full_name: data.fullName,
      country_code: data.country_code,
      phone_number: data.phone_number,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      pincode: data.zipCode,
    };
    console.log("payload",payload);
    
    mutate(payload);
  };

  const addressTypes = [
    { id: 'Home', label: 'Home' },
    { id: 'Work', label: 'Work' },
    { id: 'Other', label: 'Other' },
  ];
  const setPhoneCountryData = (item: any) => {
    setPhoneCountry(item);
    setValue('country_code', '+' + item.callingCode[0]);
  };
  return (
    <TitleBackHeaderContainer title="Add New Address" isBack>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Full Name */}
          <Input
            control={control}
            name="fullName"
            label="Full Name"
            required="Full name is required"
            error={errors}
            inputProps={{
              placeholder: "Enter Your Full Name",
              autoCapitalize: 'words',
            }}
          />
          <PhoneNumberInputs
            label={'Personal Phone Number'}
            control={control}
            name="phone_number"
            placeholder={'Enter Phone Number'}
            keyboardType="phone-pad"
            //value={getValues('mobileNumber')}
            selectedCountry={selectedCountry}
            setPhoneCountry={setPhoneCountryData}
            required={{
              value: true,
              message: 'Please enter your phone number',
            }}
            error={errors}
            disabled={false}
            style={{}}
            containerStyle={{ height: 80 ,marginVertical:20}}
          />
          <Input
            control={control}
            name="address"
            label="Address"
            required="Address is required"
            error={errors}
            multiline={true}
            inputProps={{
              placeholder: "Enter Your Address",
              numberOfLines: 3,
              textAlignVertical: 'top',
            }}
            inputStyle={styles.multilineInput}
          />

          {/* Country */}
          <InputCountry
            control={control}
            name="country"
            placeholder="Select Country"
            label="Country"
            required={{ value: true, message: 'Country is required' }}
            error={errors}
            containerStyle={styles.containerStyle}
          />

          {/* State */}
          {/* <InputState
            control={control}
            name="state"
            placeholder="Select State"
            label="State"
            error={errors}
            country={watchedCountry}
            containerStyle={styles.containerStyle}
            required={{ value: true, message: 'Country is required' }}
          /> */}
          <InputState
            control={control}
            name="state"
            label={'State'}
            country={
              watch('country') === 'US' ? 'United States' : getValues('country')
            }
            placeholder={'State'}
            error={errors}
            required={{value: true, message: 'State is required'}}
          />


          {/* City */}
          {/* <InputCity
            control={control}
            name="city"
            placeholder="Select City"
            label="City"
            required="City is required"
            error={errors}
            country={watchedCountry}
            state={watchedState}
            containerStyle={styles.containerStyle}
          /> */}
          <InputCity
            control={control}
            name="city"
            label={'City'}
            country={
              watch('country') === 'US' ? 'United States' : getValues('country')
            }
            state={watch('state') ? getValues('state') : undefined}
            placeholder={'City'}
            error={errors}
            required={{value: true, message: 'City is required'}}
          />

          {/* Zip Code */}
          <Input
            control={control}
            name="zipCode"
            label="Zip Code"
            required="Zip code is required"
            error={errors}
            keyboardType="numeric"
            inputProps={{
              placeholder: "Enter zip code",
              maxLength: 10,
            }}
            containerStyle={styles.containerStyle}

          />

          {/* Address Type */}
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Address Type</Text>
            <View style={styles.addressTypeContainer}>
              {addressTypes.map((type) => {
                const isSelected = watch('addressType') === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.addressTypeButton,
                      isSelected && styles.selectedAddressTypeButton
                    ]}
                    onPress={() => setValue('addressType', type.id)}
                  >
                    <Text style={[
                      styles.addressTypeText,
                      isSelected && styles.selectedAddressTypeText
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setValue('isDefault', !watch('isDefault'))}
            >
              <View style={[
                styles.checkbox,
                watch('isDefault') && styles.checkboxChecked
              ]}>
                {watch('isDefault') && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>Set as default address</Text>
            </TouchableOpacity>
          </View> */}

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button title="Save Address" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </ScrollView>
    </TitleBackHeaderContainer>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontWeight: '500',
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
    marginBottom: 10,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    borderRadius: 10
  },
  addressTypeContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 4,
},
  selectedAddressTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addressTypeText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  selectedAddressTypeText: {
    color: colors.white,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text2,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  containerStyle:{marginVertical:5}
}); 