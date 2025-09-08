import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import RenderHTML from 'react-native-render-html';
import colors from '../../utils/colors';
import { fontSizes, sanitizeHtmlContent } from '../../utils/utils';
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
  // Sanitize the content before rendering to prevent iOS crashes
  const sanitizedContent = React.useMemo(() => {
    const sanitized = sanitizeHtmlContent(content); 
    return sanitized;
  }, [content]);

  // State to track if HTML rendering fails
  const [htmlRenderFailed, setHtmlRenderFailed] = React.useState(false);
  const [renderTimeout, setRenderTimeout] = React.useState(false);

  // Reset HTML render state when content changes
  React.useEffect(() => {
    setHtmlRenderFailed(false);
    setRenderTimeout(false);
  }, [content]);

  // Set a timeout for HTML rendering to prevent hanging
  React.useEffect(() => {
    if (!loading && content && !htmlRenderFailed) {
      const timer = setTimeout(() => {
        console.warn('HTML render timeout, falling back to plain text');
        setRenderTimeout(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    }
  }, [loading, content, htmlRenderFailed]);

  // Function to strip HTML tags for fallback display
  const stripHtmlTags = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  // Safe HTML renderer component with error boundary
  const SafeHTMLRenderer = React.useCallback(() => {
    try {
      return (
        <RenderHTML
          source={{ html: sanitizedContent }}
          contentWidth={300}
          tagsStyles={{
            p: styles.contentText,
            h1: styles.contentText,
            h3: styles.contentText,
            ul: styles.contentText,
            li: styles.contentText,
          }}
          baseStyle={{
            fontSize: fontSizes.medium,
            color: colors.label,
            fontFamily: fonts.regular,
          }}
        />
      );
    } catch (error) {
      console.warn('HTML render failed, falling back to plain text:', error);
      setHtmlRenderFailed(true);
      return null;
    }
  }, [sanitizedContent]);

  // Error boundary component for HTML rendering
  const HTMLRendererWithErrorBoundary = React.useCallback(() => {
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      if (hasError) {
        setHtmlRenderFailed(true);
      }
    }, [hasError]);

    if (hasError) {
      return (
        <Text style={styles.contentText}>
          {stripHtmlTags(sanitizedContent)}
        </Text>
      );
    }

    try {
      return (
        <RenderHTML
          source={{ html: sanitizedContent }}
          contentWidth={300}
          tagsStyles={{
            p: styles.contentText,
            h1: styles.contentText,
            h3: styles.contentText,
            ul: styles.contentText,
            li: styles.contentText,
          }}
          baseStyle={{
            fontSize: fontSizes.medium,
            color: colors.label,
            fontFamily: fonts.regular,
          }}
        />
      );
    } catch (error) {
      console.warn('HTML render error caught, falling back to plain text:', error);
      setHasError(true);
      return (
        <Text style={styles.contentText}>
          {stripHtmlTags(sanitizedContent)}
        </Text>
      );
    }
  }, [sanitizedContent]);

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
          {/* Always show close button so user can close modal */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Seller Agreement</Text>
          
          {/* Add mandatory notice if applicable */}
          {isMandatory && (
            <Text style={styles.mandatoryNotice}>
              You must accept the Seller Agreement to continue using the app.
            </Text>
          )}

          <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={true}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading Seller Agreement...</Text>
              </View>
            ) : htmlRenderFailed || renderTimeout ? (
              // Fallback to plain text if HTML rendering fails or times out
              <Text style={styles.contentText}>
                {stripHtmlTags(sanitizedContent)}
              </Text>
            ) : (
              // Try HTML rendering with error boundary
              <HTMLRendererWithErrorBoundary />
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
              <Text style={styles.checkboxLabel}>I agree to the Seller Agreement</Text>
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