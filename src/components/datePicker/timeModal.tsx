import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import fonts from '../../assets/fonts/fonts';
import Modal from 'react-native-modal';
import colors from '../../utils/colors';

interface TimePickerComponentProps {
  value: Date;
  visible: boolean;
  onClose: () => void;
  onTimeChange: (newTime: Date) => void;
}

const TimeModal: React.FC<TimePickerComponentProps> = ({
  value,
  visible,
  onClose,
  onTimeChange,
}) => {
  return (
    <>
      <Modal isVisible={visible} style={styles.model}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DatePicker
              date={value}
              onDateChange={onTimeChange}
              mode="time"
              theme="auto"
            />
            <View style={styles.button}>
              <TouchableOpacity onPress={onClose} style={styles.doneView}>
                <Text style={styles.selectedDateText}>{'Done'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.doneView}>
                <Text style={styles.selectedDateText}>{'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    marginTop: 22,
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  doneView: {
    backgroundColor: colors.primary,
    width: 90,
    height: 30,
    alignSelf: 'center',
    borderRadius: 20,
    justifyContent: 'center',
  },
  selectedDateText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.secondary,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  model: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  button: {flexDirection: 'row', gap: 20},
});

export default TimeModal;
