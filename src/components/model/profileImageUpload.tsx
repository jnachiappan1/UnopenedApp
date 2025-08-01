import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Controller} from 'react-hook-form';
import Modal from 'react-native-modal';
import fonts from '../../assets/fonts/fonts';
import {fontSizes} from '../../utils/utils';
import colors from '../../utils/colors';
import { getProfileImage } from '../../utils/method';

type IInputProps = {
  control: any;
  name: string;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const ProfileImageUpload = ({control, name, isVisible, setIsVisible}: IInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}}) => (
        <Modal
          isVisible={isVisible}
          onBackdropPress={() => setIsVisible(false)}
          onBackButtonPress={() => setIsVisible(false)}
          backdropOpacity={0.5}
          onSwipeComplete={() => {
            setIsVisible(false);
          }}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          style={styles.modalStyle}>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={async () => {
                try {
                  const res = await getProfileImage(false, false); // Gallery
                  if (res && res.path) {
                    const imageObj = {
                      name: `${name}.${res.path.substr(res.path.lastIndexOf('.') + 1)}`,
                      type: res.mime,
                      uri: res.path,
                    };
                    onChange(imageObj);
                    setIsVisible(false);
                  } else {
                    console.log('No image selected from gallery');
                  }
                } catch (error) {
                  console.error('Error selecting image from gallery:', error);
                }
              }}>
              <Text style={styles.title}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={async () => {
                try {
                  const res = await getProfileImage(true, false); // Camera
                  if (res && res.path) {
                    const imageObj = {
                      name: `${name}.${res.path.substr(res.path.lastIndexOf('.') + 1)}`,
                      type: res.mime,
                      uri: res.path,
                    };
                    onChange(imageObj);
                    setIsVisible(false);
                  } else {
                    console.log('No image captured from camera');
                  }
                } catch (error) {
                  console.error('Error capturing image from camera:', error);
                }
              }}>
              <Text style={styles.title}>Camera</Text>
            </TouchableOpacity>
            
            {/* Add Remove Image Option if there's an existing image */}
            {value && (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  onChange(''); // Clear the image
                  setIsVisible(false);
                }}>
                <Text style={[styles.title, {color: colors.red || '#FF0000'}]}>Remove Image</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => {
              setIsVisible(false);
            }}>
            <Text style={styles.close}>Cancel</Text>
          </TouchableOpacity>
        </Modal>
      )}
    />
  );
};

export default ProfileImageUpload;

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  title: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  btn: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 13,
    marginHorizontal: 10,
    borderBottomColor: colors.border,
    justifyContent: 'center',
  },
  btnClose: {
    backgroundColor: colors.white,
    marginBottom: 26,
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  close: {
    color: colors.primary,
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
  },
  btnContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 8,
  },
});