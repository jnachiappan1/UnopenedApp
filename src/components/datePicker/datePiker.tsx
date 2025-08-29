import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import moment from 'moment';
import YearList from './yearList';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import useDateNavigation from '../hooks/useDateNavigation';
type IProps = {
  onDateSelect?: any;
  isVisible?: boolean;
  onClose?: () => void;
  minDate?: string;
  maxDate?: string;
};
const DatePiker: React.FC<IProps> = props => {
  const {isVisible = false, onDateSelect, onClose, minDate, maxDate} = props;
  const {formattedDate, goToNextMonth, goToPreviousMonth, setCurrentDate} =
    useDateNavigation();
  const [showYear, setShowYear] = useState<boolean>(false);

  // const today = moment().add(1, 'day').format('YYYY-MM-DD');
  const today = minDate || moment().format('YYYY-MM-DD');
  const nextMonth = maxDate || moment().add(1, 'month').format('YYYY-MM-DD');
  const renderHeader = (date: Date) => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.monthBtn}
        onPress={() => setShowYear(true)}>
        <Text style={styles.headerText}>
          {moment(date.getTime()).format('MMMM YYYY')}
          <IconsSvg name="iconArrowDown" />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnArrow} onPress={goToPreviousMonth}>
        <IconsSvg name="iconArrowLeft" />
      </TouchableOpacity>
      <View style={{width: 20}} />
      <TouchableOpacity style={styles.btnArrow} onPress={goToNextMonth}>
        <IconsSvg name="iconArrowRight" />
      </TouchableOpacity>
    </View>
  );
  return (
    <Modal
      isVisible={isVisible}
      style={styles.container}
      backdropOpacity={0.3}
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}>
      <View style={styles.calenderContainer}>
        <TouchableOpacity
          style={styles.line}
          onPress={onClose}
          activeOpacity={0.3}
        />
        {showYear ? (
          <YearList
            formattedDate={formattedDate}
            onChange={arg => {
              setCurrentDate(arg);
              setShowYear(false);
            }}
          />
        ) : (
          <Calendar
            initialDate={formattedDate}
            renderHeader={renderHeader}
            renderArrow={() => <View />}
            onDayPress={(day:any) => {
              if (onDateSelect) {
                onDateSelect(day.dateString);
              }
            }}
            style={styles.cal}
            numberOfDays={7}
            theme={{
              textSectionTitleColor: colors.primary,
              textDayHeaderFontWeight: '500',
              agendaDayNumColor: 'red',
            }}
            minDate={today}
            maxDate={nextMonth}
          />
        )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {justifyContent: 'flex-end', margin: 0},
  calenderContainer: {backgroundColor: colors.white, borderRadius: 10},
  line: {
    height: 6,
    backgroundColor: colors.border,
    marginTop: 10,
    borderRadius: 3,
    alignSelf: 'center',
  },
  cal: {height: Dimensions.get('screen').height / 2.2},
  header: {
    flexDirection: 'row',
    marginStart: -18,
    marginEnd: 18,
    marginBottom: 10,
  },
  headerText: {
    fontSize: fontSizes.regular,
    color: colors.primary,
  },
  btnArrow: {
    backgroundColor: colors.white,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  monthBtn: {flex: 1, justifyContent: 'center'},
});
export default DatePiker;
