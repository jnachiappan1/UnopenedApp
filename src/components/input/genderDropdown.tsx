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
import { Control, Controller, ValidationRule } from 'react-hook-form';
import IconsSvg from '../../assets/svg/iconsSvg';

type InputProps = {
  control: Control;
  name: string;
  error?: any;
  placeholder?: string;
  label?: string;
  required?: string | ValidationRule<boolean> | undefined;
};

const GenderDropdown: React.FC<InputProps> = ({
  control,
  name,
  error,
  placeholder = 'Select Gender',
  label,
  required
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const errorMessage =
    error && error[name] ? error[name]?.message?.toString() : '';

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.dropdownContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              error && name in error && styles.dropdownButtonError,
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

          {error && name in error && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <Modal
            visible={isOpen}
            transparent
            animationType="slide"
            onRequestClose={() => setIsOpen(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={genderOptions}
                  keyExtractor={item => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
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

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
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
    color: '#999',
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default GenderDropdown;
