import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import fonts from '../../assets/fonts/fonts';
import IMAGE from '../../assets/images';
import IconsSvg from '../../assets/svg/iconsSvg';
import { setLoader } from '../../redux/reducers/app/AppReducer';
import { CommonActions } from '@react-navigation/native';
import { capitalizeFirstLetter, fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';
import { IRootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import IconTitleCard from '../../components/card/iconTitleCard';
import Button from '../../components/button/buttons';
import LogOutModal from '../../components/model/logIssueModal';
import { handleError, handleSettled } from '../../utils/method';
import { removeToken, removeUserData, saveUserType } from '../../redux/reducers/user/UserReducer';
import { showAlert } from '../../components/cAlert';
import { useMutation } from '@tanstack/react-query';
import { deleteAPI, logOutAPI } from '../../utils/apiAction';

type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ProfileScreen
>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const userType = useSelector((user: IRootState) => user.user.userType);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const userData = useSelector((user: IRootState) => user.user.userData);

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteAPI,
    onSuccess: (data: any) => {
      setLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Delete',
        description: capitalizeFirstLetter(data?.message),
        doneText: 'Okay',
        onDonePress: () => {
          setTimeout(() => {
            dispatch(removeToken());
            dispatch(removeUserData());
          }, 500);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: SCREENS.LoginScreen }],
            }),
          );
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled
  });

  const deleteData = () => {
    setDeleteModalVisible(false);
    setLoader(true);
    deleteMutation();
  };
  const { mutate: logOutMutation } = useMutation({
    mutationFn: logOutAPI,
    onSuccess: (data: any) => {

      setLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Logout',
        description: capitalizeFirstLetter(data?.message),
        doneText: 'Okay',
        onDonePress: () => {
          setTimeout(() => {
            dispatch(saveUserType('buyer'));
            dispatch(removeToken());
            dispatch(removeUserData());
          }, 500);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: SCREENS.LoginScreen }],
            }),
          );
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled
  });
  const logoutPress = () => {
    setLogoutModalVisible(false);
    setLoader(true);
    logOutMutation();
  };
  console.log(userType);
  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    const formData = new FormData();
    formData.append('email', !isEnabled);
  };
  return (
    <TitleBackHeaderContainer isBack title={"My Profile"} containerStyle={{}}>
      {!userData ? (
        <View style={styles.loginContainer}>
          <Text style={styles.detailStyle}>Login to get exclusive Offers</Text>
          <Button
            title={'Login'}
            style={styles.sendOtpButton}
            onPress={() => navigation.navigate(SCREENS.ProfileLoginScreen)}
          />
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <View style={styles.profileDetailContainer}>
            <Image
              source={IMAGE.profileImage}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.nameContainer}>
              <View style={styles.userTypeCOntainer}>
                <IconsSvg
                  name="rupesIcon"
                  style={styles.rupesIconStyle}
                />
                <Text style={styles.userType}>{userType}</Text>
              </View>
              <Text style={styles.nameStyle}>{userData?.full_name}</Text>
              <Text style={styles.gmailStyle}>{userData?.email}</Text>
            </View>
          </View>
          <IconsSvg
            name="edit"
            style={styles.editIconStyle}
            onPress={() => navigation.navigate(SCREENS.EditProfileScreen)}
          />
        </View>
      )}

      <Text style={styles.title}>{'General'}</Text>
      <View style={styles.menuContainer}>
        {
          userData &&
          <IconTitleCard
            title={"Change Password"}
            svgName={'changePassword'}
            rightArrow
            onPress={() => navigation.navigate(SCREENS.ChangePasswordScreen)}
          />
        }

        <IconTitleCard
          title={"Terms & Conditions"}
          svgName={'termsAndConditions'}
          onPress={() => navigation.navigate(SCREENS.TermsConditionsScreen)}
          rightArrow
        />
        <IconTitleCard
          title={"Privacy Policy"}
          svgName={'privacyPolicy'}
          rightArrow
          onPress={() => navigation.navigate(SCREENS.PrivacyPolicyScreen)}

        />
        <IconTitleCard
          title={"Help & Support"}
          svgName={'helpAndSupport'}
          rightArrow
          onPress={() => navigation.navigate(SCREENS.HelpSupportScreen)}
        />
        {
          userData &&
          <IconTitleCard
            title={"Notification"}
            svgName={'notification'}
            isToggleButtonOnOff
            style={{ paddingHorizontal: 15 }}
          />
        }
        {
          userData &&
          <IconTitleCard
            title={"Logout"}
            svgName={'logout'}
            rightArrow
            onPress={() => setLogoutModalVisible(true)}
          />
        }
        {
          userData &&
          <IconTitleCard
            title={"Delete Account"}
            svgName={'deleteAccount'}
            rightArrow
            onPress={() => setDeleteModalVisible(true)}
          />
        }
        {
          userData &&
          <LogOutModal
            isModalVisible={isDeleteModalVisible}
            setModalVisible={setDeleteModalVisible}
            onSubmit={deleteData}
            title="Are You Sure?"
            description="Please confirm you want to delete."
          />
        }
        {
          userData &&
          <LogOutModal
            isModalVisible={isLogoutModalVisible}
            setModalVisible={setLogoutModalVisible}
            onSubmit={logoutPress}
            title="Are You Sure?"
            description="Please confirm you want to logout."
          />
        }
      </View>
    </TitleBackHeaderContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  nameStyle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: '#1F1F1F',
  },
  detailStyle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  mailStyle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: '#333333',
    marginTop: 9,
  },
  textStyle: { textAlign: 'center' },
  loginContainer: {
    backgroundColor: colors.white,
    marginVertical: 10,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60
  },
  profileContainer: {
    backgroundColor: colors.white,
    marginVertical: 10,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 94
  },
  profileDetailContainer: {
    flexDirection: 'row', alignItems: 'center'
  },
  title: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    paddingStart: 16,
    color: "#21252B",
    marginBottom: 10
  },
  userType: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    paddingStart: 5,
    color: colors.primary,
    textTransform: 'capitalize'
  },
  gmailStyle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    paddingStart: 2,
    color: '#666666'
  },
  menuContainer: {
    marginHorizontal: 10,
    backgroundColor: colors.white,
    marginBottom: 10,
    paddingHorizontal: 10,
    // paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 1300,
  },
  editIconStyle: {
    //  position: 'absolute', bottom: 0, right: 0
  },
  rupesIconStyle: {
    //  position: 'absolute', bottom: 0, right: 0
  },
  nameContainer: { flexDirection: 'column', paddingStart: 10 },
  userTypeCOntainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
    width: 95,
    height: 24,
  },
  emailNotificationStyle: { backgroundColor: colors.secondary, paddingHorizontal: 10 },
  sendOtpButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // marginHorizontal: 24,
    paddingHorizontal: 15,
    borderRadius: 120,
    marginHorizontal: 5,
    height: 36,
  },
});
