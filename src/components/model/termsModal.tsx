import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import RenderHTML from 'react-native-render-html';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  content: string;
  loading: boolean;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  onAccept?: () => void; // New prop for handling acceptance
  isMandatory?: boolean; // New prop to determine if modal is mandatory
  acceptLoading?: boolean; // New prop for accept button loading state
}

const TermsModal: React.FC<TermsModalProps> = ({
  visible,
  onClose,
  content,
  loading,
  checked,
  onCheck,
  onAccept,
  isMandatory = false,
  acceptLoading = false,
}) => {
  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      // Prevent dismissing modal on Android back button if mandatory
      onRequestClose={() => {
        if (!isMandatory) {
          onClose();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Only show close button if not mandatory */}
          {!isMandatory && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          
          <Text style={styles.title}>Terms & Conditions</Text>
          
          {/* Add mandatory notice if applicable */}
          {isMandatory && (
            <Text style={styles.mandatoryNotice}>
              You must accept the Terms & Conditions to continue using the app.
            </Text>
          )}

          <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={true}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading Terms & Conditions...</Text>
              </View>
            ) : (
              <RenderHTML
                source={{ html: content }}
                contentWidth={300}
                tagsStyles={{
                  p: styles.contentText,
                  h1: styles.contentText,
                  h3: styles.contentText,
                  ul: styles.contentText,
                  li: styles.contentText,
                }}
              />
            )}
          </ScrollView>

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => onCheck(!checked)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Text style={styles.checkIcon}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>I agree to the Terms & Conditions</Text>
            </TouchableOpacity>

            {/* Show Accept button if onAccept is provided */}
            {onAccept && (
              <TouchableOpacity
                style={[
                  styles.acceptButton,
                  !checked && styles.acceptButtonDisabled
                ]}
                onPress={onAccept}
                disabled={!checked || acceptLoading}
                activeOpacity={0.8}
              >
                {acceptLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={[
                    styles.acceptButtonText,
                    !checked && styles.acceptButtonTextDisabled
                  ]}>
                    Accept & Continue
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {/* Show different buttons based on mandatory status */}
            {!onAccept && (
              <View style={styles.buttonContainer}>
                {isMandatory ? (
                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      !checked && styles.acceptButtonDisabled
                    ]}
                    onPress={() => {
                      if (checked) {
                        onClose();
                      }
                    }}
                    disabled={!checked}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.acceptButtonText,
                      !checked && styles.acceptButtonTextDisabled
                    ]}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={onClose}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.acceptButton,
                        styles.acceptButtonSmall,
                        !checked && styles.acceptButtonDisabled
                      ]}
                      onPress={() => {
                        if (checked) {
                          onClose();
                        }
                      }}
                      disabled={!checked}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.acceptButtonText,
                        !checked && styles.acceptButtonTextDisabled
                      ]}>
                        Accept
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.label,
  },
  title: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    marginBottom: 10,
    color: colors.black,
    textAlign: 'center',
  },
  mandatoryNotice: {
    fontSize: fontSizes.small,
    color: colors.primary,
    fontFamily: fonts.medium,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  contentContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: fontSizes.regular,
    color: colors.label,
    marginTop: 10,
    fontFamily: fonts.regular,
  },
  contentText: {
    fontSize: fontSizes.medium,
    color: colors.label,
    fontFamily: fonts.regular,
    marginHorizontal: 5,
    lineHeight: 22,
  },
  bottomContainer: {
    marginTop: 'auto',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkIcon: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fonts.bold,
  },
  checkboxLabel: {
    fontSize: fontSizes.regular,
    color: colors.label,
    marginLeft: 8,
    fontFamily: fonts.regular,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  acceptButtonSmall: {
    flex: 1,
  },
  acceptButtonDisabled: {
    backgroundColor: '#ccc',
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
  },
  acceptButtonTextDisabled: {
    color: '#999',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 48,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
  },
});