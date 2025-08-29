import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Platform} from 'react-native';
// import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import fonts from '../../assets/fonts/fonts';
import DatePicker from 'react-native-date-picker';
import colors from '../../utils/colors';

interface TimePickerComponentProps {
  visible: boolean;
  onClose: () => void;
  onTimeChange: (newTime: Date) => void;
}

const TimePickerModal: React.FC<TimePickerComponentProps> = ({
  visible,
  onClose,
  onTimeChange,
}) => {
  const [selectedTime, setSelectedTime] = React.useState<Date>(new Date());

  const handleDone = () => {
    onTimeChange(selectedTime);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      key={visible ? 'visible' : 'hidden'}
      isVisible={visible}
      style={{
        margin: 0,
        justifyContent: 'flex-end',
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DatePicker
            //date={new Date()}
            date={selectedTime}
            onDateChange={value => setSelectedTime(value)}
            mode="time"
            theme="auto"
            // timeZoneOffsetInMinutes={0}
          />
          <View style={{flexDirection: 'row', gap: 20}}>
            <TouchableOpacity onPress={handleDone} style={styles.doneView}>
              <Text style={styles.selectedDateText}>{'Done'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.doneView}>
              <Text style={styles.selectedDateText}>{'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
});

export default TimePickerModal;
