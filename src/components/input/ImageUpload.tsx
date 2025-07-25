import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';

interface ImageUploadComponentProps {
  onUpload: () => void;
  title?: string;
  subtitle?: string;
  uploadTitle?: string;
  uploadSubtitle?: string;
  containerStyle?: object;
  uploadAreaStyle?: object;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadComponentProps> = ({
  onUpload,
  title ,
  subtitle ,
  uploadTitle ,
  uploadSubtitle ,
  containerStyle,
  uploadAreaStyle,
  disabled = false,
}) => {
  return (
    <View style={[styles.uploadSection, containerStyle]}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        style={[styles.uploadArea, uploadAreaStyle, disabled && styles.disabled]}
        onPress={onUpload}
        disabled={disabled}>
        <IconsSvg name="uploadIcon" />
        <Text style={styles.uploadTitle}>{uploadTitle}</Text>
        <Text style={styles.uploadSubtitle}>{uploadSubtitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  uploadSection: {
    marginTop: 10,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontWeight: '500',
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.label,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.label,
    right:0
  },
  uploadArea: {
    borderWidth: 1.2,
    borderColor: '#B3B3B3',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    paddingVertical:50
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: '#f0f0f0',
  },
  uploadTitle: {
    fontSize: 18,
    color: colors.primaryBlack,
    marginBottom: 8,
    fontFamily: fonts.bold,
    marginTop: 15,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: fonts.medium,
  },
});