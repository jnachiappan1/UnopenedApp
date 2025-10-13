import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import commonStyles from "../../utils/common-styles";
//   import fonts from "../../assets/fonts/fonts";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//   import { fontSizes } from "../../utils/utils";
import { SCREENS } from "../../navigation/mainNavigation";
import fonts from "../../assets/fonts/fonts";
import colors, { getColors } from "../../utils/colors";
import IconsSvg from "../../assets/svg/iconsSvg";

type HeaderContainerProps = {
  children?: React.ReactNode | undefined;
  title?: string;
  isBack?: boolean;
  isHome?: boolean;
  userName?: string;
  isRight?: boolean;
  isChatCall?: boolean;
  onBackPress?: () => void;
  isRightCancel?: boolean;
  totalCount?: any;
  onDelete?: string | any;
  isDelete?: boolean;
  onRead?: string | any;
  allRead?: boolean;
  notificationCount?: number;
};

const NotificationHeader: React.FC<HeaderContainerProps> = (props) => {
  const {
    children,
    title = "",
    isBack = false,
    isRight = false,
    isChatCall = false,
    onBackPress,
    isRightCancel = false,
    // totalCount = 0,
    isDelete = false,
    onDelete,
    onRead,
    allRead,
    notificationCount,
  } = props;
  const navigation = useNavigation<string | any>();
  const colors = getColors();
  const insets = useSafeAreaInsets();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  const handleOutsideClick = () => {
    setMenuVisible(false);
  };

  const handleClearNotifications = () => {
    onDelete();
    setMenuVisible(false);
  };

  const handleReadNotifications = () => {
    onRead();
    setMenuVisible(false);
  };

  const handleMenuLayout = (event: LayoutChangeEvent) => {
    const { x, y, width } = event.nativeEvent.layout;
    setMenuPosition({ top: y + insets.top, right: x + width });
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        marginHorizontal: 24,
      }}
    >
      <View style={{ flexDirection: "row", height: 70, alignItems: "center" }}>
        <View style={styles.itemContainer}>
          {isBack ? (
            <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
              <IconsSvg name="back" />
            </TouchableOpacity>
          ) : (
            <View style={styles.back} />
          )}
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>
        <View style={styles.rightIconView}>
          {isDelete && (
            <>
              <TouchableOpacity
                onLayout={handleMenuLayout}
                onPress={() => setMenuVisible(true)}
              >
                <IconsSvg name="notificationMenu" style={styles.deleteIcon} />
              </TouchableOpacity>
              <Modal
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
              >
                <TouchableWithoutFeedback onPress={handleOutsideClick}>
                  <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                      <View
                        style={[
                          styles.menuContainer,
                          {
                            top: menuPosition.top,
                            right: menuPosition.right,
                          },
                        ]}
                      >
                        {/* <TouchableOpacity
                          style={[
                            styles.menuItem,
                            {
                              opacity:
                                notificationCount && notificationCount > 0
                                  ? 1
                                  : 0.5,
                            },
                          ]}
                          onPress={handleClearNotifications}
                          disabled={notificationCount === 0}
                        >
                          <IconsSvg name="notificationDeleteIcon" />
                          <Text style={styles.menuText}>
                            Clear all notifications
                          </Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                          style={[
                            styles.menuItem,
                            { opacity: allRead ? 0.5 : 1 },
                          ]}
                          onPress={handleReadNotifications}
                          activeOpacity={0.3}
                          disabled={allRead}
                        >
                          <IconsSvg name="notificationTickMark" />
                          <Text style={styles.menuText}>Mark all as Read</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </>
          )}
        </View>
      </View>
      {children}
    </View>
  );
};

export default NotificationHeader;

const styles = StyleSheet.create({
  rightIconView: {},
  icon: {
    height: 48,
    width: 48,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    marginStart: 10,
  },
  badge: {
    position: "absolute",
    right: 6,
    top: 6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
    lineHeight: 18,
  },
  back: {
    flex: 0.2,
    height: 46,
    width: 46,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.medium,
    color: colors.black,
    marginHorizontal: 17,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  user: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.primary,
    marginTop: 2,
  },
  deleteIcon: {
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.black,
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingStart: 10,
  },
  backBtn: {
    backgroundColor: colors.background,
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },
});
