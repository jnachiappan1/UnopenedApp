import React from 'react';
import Modal from 'react-native-modal';
import AlertManager from './alertManager';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import IconsSvg, {IconName} from '../../assets/svg/iconsSvg';

type IState = {
  isVisible: Boolean;
  type: 'info' | 'delete' | 'success' | 'error';
  title?: string;
  description?: string;
  onDeletePress?: () => void;
  onDonePress?: () => void;
  doneText?: string;
  deleteText?: string;
};

const alertTypeToIcon: Record<IState['type'], IconName> = {
  success: 'success',
  error: 'error',
  info: 'notification',
  delete: 'deleteAccount',
};

//this function is used to show toast message using instance of ToastMessage component
export function showAlert(args: IState) {
  const ref: any = AlertManager.getCurrent();
  if (ref) {
    ref.showAlert(args);
  }
}

export default class CAlert extends React.Component<any, IState> {
  constructor(props: IState) {
    super(props);
    this.state = {
      isVisible: false,
      type: 'success',
      title: '',
      description: '',
      doneText: 'Done',
      deleteText: 'Cancel',
    };
  }

  //register and unregister component
  componentDidMount() {
    AlertManager.register(this);
  }
  componentWillUnmount() {
    AlertManager.unregister();
  }

  toggleVisibility() {
    this.setState({isVisible: false});
  }

  showAlert(arg: IState) {
    this.setState(arg);
  }

  render() {
    const show = this.state.isVisible as boolean;
    const hasDeleteButton = this.state.onDeletePress;

    return (
      <Modal
        isVisible={show}
        backdropOpacity={0}
        style={{margin: 0}}
        coverScreen={false}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}>
        <View style={styles.container}>
          <View style={styles.dialogContainer}>
            <View style={styles.animatedView}>
              <View style={styles.icon}>
                <IconsSvg name={alertTypeToIcon[this.state.type]} />
              </View>
            </View>
            {this.state.title && (
              <Text style={styles.label}>{this.state.title}</Text>
            )}
            {this.state.description && (
              <Text style={styles.description}>{this.state.description} </Text>
            )}

            {/* Button Container for better layout management */}
            <View
              style={
                hasDeleteButton
                  ? styles.twoButtonContainer
                  : styles.singleButtonContainer
              }>
              <TouchableOpacity
                style={[
                  styles.btn,
                  hasDeleteButton
                    ? styles.btnTwoButton
                    : styles.btnSingleButton,
                ]}
                onPress={() => {
                  if (this.state.type === 'error') {
                    this.setState({isVisible: false});
                  } else if (this.state.onDonePress) {
                    this.state.onDonePress();
                  }
                  this.setState({isVisible: false});
                }}>
                {this.state.doneText && (
                  <Text style={styles.btnTxt}>{this.state.doneText}</Text>
                )}
              </TouchableOpacity>

              {hasDeleteButton && (
                <TouchableOpacity
                  style={[styles.deleteBtn, styles.btnTwoButton]}
                  onPress={() => {
                    if (this.state.type === 'error') {
                      this.setState({isVisible: false});
                    } else if (this.state.onDeletePress) {
                      this.state.onDeletePress();
                    }
                    this.setState({isVisible: false});
                  }}>
                  {this.state.deleteText && (
                    <Text style={styles.btnDeleteTxt}>
                      {this.state.deleteText}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalBackGround,
  },
  dialogContainer: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: '85%',
  },
  animatedView: {
    backgroundColor: colors.lightPrimaryTint,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingVertical: 10,
  },
  description: {
    maxWidth: 256,
    fontWeight: '500',
    color: colors.text,
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
  label: {
    maxWidth: 256,
    fontWeight: '500',
    color: colors.primaryBlack,
    fontSize: 32,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },

  // Button container styles
  singleButtonContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  twoButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
    gap: 10, // Space between buttons
  },

  // Base button style
  btn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.primary,
  },

  // Single button takes full width
  btnSingleButton: {
    width: 256,
  },

  // Two buttons share the width
  btnTwoButton: {
    flex: 1,
  },

  deleteBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1.3,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },

  btnDeleteTxt: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.bold,
  },
  btnTxt: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.bold,
  },
  icon: {alignSelf: 'center'},
});
