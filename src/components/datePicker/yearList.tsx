import React, {useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import useYearList from '../hooks/useYearList';
type IProps = {
  formattedDate: string;
  onChange: (arg: any) => void;
};
const YearList: React.FC<IProps> = props => {
  const {formattedDate, onChange} = props;
  const {yearList, goToNextYears, goToPreviousYears} = useYearList(20);
  const YearContent = useMemo(
    () => (
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Select Year</Text>
          <TouchableOpacity style={styles.btnArrow} onPress={goToPreviousYears}>
            <IconsSvg name="iconArrowLeft" />
          </TouchableOpacity>
          <View style={{width: 20}} />
          <TouchableOpacity style={styles.btnArrow} onPress={goToNextYears}>
            <IconsSvg name="iconArrowRight" />
          </TouchableOpacity>
        </View>
        <FlatList
          key={'year'}
          data={yearList}
          numColumns={4}
          renderItem={item => {
            const isCheck =
              moment(formattedDate).format('YYYY') == item.item.toString();
            const style = [
              styles.item,
              {
                backgroundColor: isCheck ? colors.primary : colors.white,
              },
            ];
            return (
              <TouchableOpacity
                style={style}
                onPress={() => {
                  let date = moment(formattedDate).year(item.item);
                  onChange(date);
                }}>
                <Text
                  style={{
                    color: !isCheck ? colors.primary : colors.background,
                  }}>
                  {item.item}
                </Text>
              </TouchableOpacity>
            );
          }}
          style={styles.flatList}
        />
      </View>
    ),
    [yearList, formattedDate, onChange],
  );
  return YearContent;
};
export default YearList;
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 18,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    margin: 4,
    borderRadius: 4,
  },
  title: {flex: 1, fontSize: fontSizes.regular, color: colors.primary},
  buttonCOntainer: {flexDirection: 'row'},
  flatList: {
    height: Dimensions.get('screen').height / 3.1,
    marginHorizontal: 10,
  },
  btnArrow: {
    backgroundColor: colors.white,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
});
