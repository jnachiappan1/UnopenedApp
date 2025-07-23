import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import Button from '../button/buttons';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';

type LogOutModalProps = {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSubmit: () => void;
  title: string;
  description: string;
};

const LogOutModal: React.FC<LogOutModalProps> = ({
  isModalVisible,
  setModalVisible,
  onSubmit,
  title = "Are You Sure?", 
  description = "Please confirm you want to Delete.", 
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      backdropOpacity={0.3}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      style={styles.modelStyle}
    >
      <View style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.modalContent}>
        <IconsSvg name="successCheckMark" />
          <Text style={styles.headingStyle}>{title}</Text>
          <Text style={styles.descriptionStyle}>{description}</Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title={'Cancel'}
              style={styles.cancelBtn}
              textStyle={styles.cancelTextBtn}
              onPress={() => setModalVisible(false)}
            />
            <Button
              title={'Yes'}
              style={styles.confirmBtn}
              textStyle={styles.confirmTextBtn}
              onPress={onSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modelStyle: {
    margin: 0,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: colors.white, 
    borderRadius: 10,
    alignItems:'center'
  },
  headingStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionStyle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    backgroundColor: colors.white,
    borderRadius: 120,
    height:45,
    width:115,
    borderColor:'#E0E0E0',
    borderWidth:1
    //minWidth: 151,
  },
  cancelTextBtn:{
    color: '#4C4C4C',
    fontFamily: fonts.regular,
    fontSize: fontSizes.medium,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 120,
    height:45,
    width:115
    // minWidth: 151,
  },
  confirmTextBtn: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: fontSizes.medium,
  },
});

export default LogOutModal;
