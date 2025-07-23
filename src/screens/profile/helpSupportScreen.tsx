import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import fonts from '../../assets/fonts/fonts';
import IMAGE from '../../assets/images';
import IconsSvg from '../../assets/svg/iconsSvg';
import { setLoader } from '../../redux/reducers/app/AppReducer';
import { CommonActions } from '@react-navigation/native';
import { fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';
import { IRootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import IconTitleCard from '../../components/card/iconTitleCard';
import Button from '../../components/button/buttons';
import LogOutModal from '../../components/model/logIssueModal';

type HelpSupportScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.HelpSupportScreen
>;

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ navigation }) => {
  return (
    <TitleBackHeaderContainer isBack title={"Terms & Conditions"} containerStyle={{}}>
      <Text style={{paddingHorizontal:15}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras viverra vehicula sodales. Nam convallis nulla a justo vehicula auctor. Donec pharetra tincidunt purus in sollicitudin. Mauris volutpat varius nulla sed fringilla. In ut ligula consequat, elementum augue non, rhoncus sapien. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque bibendum, sapien ut vestibulum tincidunt, ante enim ultricies erat, nec imperdiet augue tellus quis lectus. Vestibulum bibendum sapien nunc, ut sagittis odio tristique quis. In vitae faucibus risus. Vestibulum varius odio id neque pulvinar, in rhoncus magna maximus.</Text>
    </TitleBackHeaderContainer>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({

});
