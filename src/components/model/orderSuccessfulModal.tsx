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

type OrderSuccessfulModalProps = {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSubmit: () => void;
  onContinue: () => void;
  title: string;
  description: string;
};

const OrderSuccessfulModal: React.FC<OrderSuccessfulModalProps> = ({
  isModalVisible,
  setModalVisible,
  onSubmit,
  onContinue,
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
        <StatusBar barStyle="dark-content" backgroundColor="'rgba(0,0,0,0.5)" />
        <View style={styles.modalContent}>
        <IconsSvg name="orderSuccessful" />
          <Text style={styles.headingStyle}>{"Order Successful"}</Text>
          <Text style={styles.descriptionStyle}>{"Your order has been placed successfully"}</Text>
          <View style={styles.deliveryCard}>
          <Text style={styles.deliveryDate}>
          Estimated Delivery by 11 July
          </Text>
          <Text style={styles.orderIDStyle}>{"Order ID: ORD#15424"}</Text>
        </View>
        <View style={styles.buttonContainer}>
            <Button
              title={'Continue Shopping'}
              style={styles.cancelBtn}
              textStyle={styles.cancelTextBtn}
              onPress={() => {
                setModalVisible(false);
                onContinue(); 
              }}
            />
            <Button
              title={'Track Order'}
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
    width: '90%',
    paddingVertical: 20,
    backgroundColor: colors.white, 
    borderRadius: 10,
    alignItems:'center'
  },
  headingStyle: {
    fontSize: fontSizes.mGigantic,
    fontFamily: fonts.bold,
    marginVertical: 5,
    textAlign: 'center',
  },
  descriptionStyle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.regular,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',   
    justifyContent:'space-around',
    width:'100%'
  },
  cancelBtn: {
    backgroundColor: colors.white,
    borderRadius: 120,
    borderColor:colors.primary,
    borderWidth:1,
    width:'45%',
    marginHorizontal: 0,
    paddingHorizontal: 10,
    height: 54,
    //minWidth: 151,
  },
  cancelTextBtn:{
    color: colors.primary,
    fontFamily: fonts.regular,
    fontSize: fontSizes.medium,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 120,
    marginHorizontal: 0,
    paddingHorizontal: 10,
    height: 54,
    width:'45%',
  },
  confirmTextBtn: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: fontSizes.medium,
  },
  deliveryCard: {
    backgroundColor: '#F5F7F2',
    borderRadius: 8,
    padding: 8,
    width:"90%",
    alignItems:'center',
    marginBottom:15
  },
  deliveryDate: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.primary,
    paddingVertical:5
  },
  orderIDStyle: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.regular,
    textAlign: 'center',
  },
});

export default OrderSuccessfulModal;
