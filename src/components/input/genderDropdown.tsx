import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Control, Controller, FieldValues, Path, ValidationRule } from 'react-hook-form';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';

type GenderOption = {
  label: string;
  value: string;
};

type InputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  error?: Partial<Record<keyof T, { message?: string }>>;
  placeholder?: string;
  label?: string;
  required?: string | ValidationRule<boolean>;
};

const GenderDropdown = <T extends FieldValues>({
  control,
  name,
  error,
  placeholder = 'Select Gender',
  label,
  required,
}: InputProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const genderOptions: GenderOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  const selectedError = error?.[name]?.message;

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      render={({ field: { onChange, value } }) => (
        <View style={styles.dropdownContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              selectedError && styles.dropdownButtonError,
            ]}
            onPress={() => setIsOpen(true)}
          >
            <Text
              style={[styles.dropdownText, !value && styles.placeholderText]}
            >
              {value
                ? genderOptions.find(opt => opt.value === value)?.label
                : placeholder}
            </Text>
            <IconsSvg name="downArrow" />
          </TouchableOpacity>

          {selectedError && (
            <Text style={styles.errorText}>{selectedError}</Text>
          )}

          <Modal
            visible={isOpen}
            transparent
            animationType="slide"
            onRequestClose={() => setIsOpen(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Gender</Text>
                  <TouchableOpacity
                    onPress={() => setIsOpen(false)}
                    style={styles.cancelButton}
                  >
                    {/* <Text style={styles.cancelButtonText}>Cancel</Text> */}
                    <IconsSvg name="cancelIcon" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={genderOptions}
                  keyExtractor={item => item.value}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        index === genderOptions.length - 1 && styles.optionItemLast,
                      ]}
                      onPress={() => {
                        onChange(item.value);
                        setIsOpen(false);
                      }}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
      )}
    />
  );
};

export default GenderDropdown;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 160,
    backgroundColor: '#fff',
    minHeight: 53,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownButtonError: {
    borderColor: '#ff6b6b',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: colors.black,
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    minHeight: 12,
    marginVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    // borderTopLeftRadius: 16,
    // borderTopRightRadius: 16,
    maxHeight: 300,
    // elevation: 5,
    borderRadius: 16,
    marginHorizontal: 20,
    // width:"90%",
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.secondary || '#007AFF',
    fontWeight: '500',
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
