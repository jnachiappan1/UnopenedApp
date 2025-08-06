import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import Button from '../button/buttons';
import Input from '../input/input';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';
import { useForm } from 'react-hook-form';

type ContactSupportModalProps = {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onMessageSubmit?: (message: string) => void;
};

type FormData = {
  message: string;
};

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isModalVisible,
  setModalVisible,
  onMessageSubmit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (onMessageSubmit) {
      onMessageSubmit(data.message);
    }
    setModalVisible(false);
  };

  const handleCancel = () => {
    reset();
    setModalVisible(false);
  };

  return (
    <Modal
      isVisible={isModalVisible}
      backdropOpacity={0.3}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      style={styles.modelStyle}
    >
      <View style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.modalBackGround} />
        <View style={styles.modalContent}>
          <IconsSvg name="helpSupportIcon" />
          <Text style={styles.headingStyle}>Contact Support</Text>
          <Text style={styles.descriptionStyle}>
            Please describe your issue or question below. We'll get back to you as soon as possible.
          </Text>
          
          <View style={styles.inputContainer}>
            <Input
              control={control}
              name="message"
              label="Message"
              required="Message is required"
              multiline={true}
              inputProps={{
                placeholder: "Type your message here...",
                numberOfLines: 4,
                textAlignVertical: 'top',
              }}
              inputStyle={styles.messageInput}
              error={errors}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title={'Cancel'}
              style={styles.cancelBtn}
              textStyle={styles.cancelTextBtn}
              onPress={handleCancel}
            />
            <Button
              title={'Submit'}
              style={styles.confirmBtn}
              textStyle={styles.confirmTextBtn}
              onPress={handleSubmit(onSubmit)}
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
    width: '85%',
    padding: 20,
    backgroundColor: colors.white, 
    borderRadius: 12,
    alignItems: 'center',
  },
  headingStyle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionStyle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.regular,
    color: colors.text3,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  messageInput: {
    height: 120,
    borderWidth:1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 12,

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    backgroundColor: colors.white,
    borderRadius: 120,
    height: 45,
    flex: 1,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  cancelTextBtn: {
    color: '#4C4C4C',
    fontFamily: fonts.regular,
    fontSize: fontSizes.medium,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 120,
    height: 45,
    flex: 1,
  },
  confirmTextBtn: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: fontSizes.medium,
  },
});

export default ContactSupportModal; 