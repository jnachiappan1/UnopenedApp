import React from 'react';
import Modal from 'react-native-modal';
import AlertManager from './alertManager';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';

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
                <IconsSvg
                  name={this.state.type ? this.state.type : 'success'}
                />
              </View>
            </View>
            {this.state.title && (
              <Text style={styles.label}>{this.state.title}</Text>
            )}
            {this.state.description && (
              <Text style={styles.description}>{this.state.description} </Text>
            )}

            <TouchableOpacity
              style={styles.btn}
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
            {this.state.onDeletePress && (
              <TouchableOpacity
                style={styles.deleteBtn}
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
  btn: {
    width: 256,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 22,
    backgroundColor: colors.primary,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  deleteBtn: {
    width: 256,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1.3,
    borderColor: colors.primary,
    marginBottom: 20,
    marginHorizontal: 20,
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
