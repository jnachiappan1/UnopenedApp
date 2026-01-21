import { StyleSheet } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import { showLoader } from '../../components/loader/loader';
import RenderHTML from 'react-native-render-html';
import { getLegalcontent } from '../../utils/apiAction';
import colors from '../../utils/colors';
import { fontSizes, OS } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import { useWindowDimensions } from 'react-native';

type TermsConditionsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.TermsConditionsScreen
>;

const TermsConditionsScreen: React.FC<TermsConditionsScreenProps> = ({ navigation, route }) => {
  const { type } = route.params;
  const [privacyPolicy, setPrivacyPolicy] = useState<string>('');
  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      showLoader(true);
      const response = await getLegalcontent(type);
      setPrivacyPolicy(response.data.legalContent.content);
      showLoader(false);
    } catch (error) {
      console.error('Error fetching terms and conditions:', error);
    }
  };
  const { width } = useWindowDimensions();
  const renderHTMLMemoized = useMemo(
    () => (
      <RenderHTML
        source={{ html: privacyPolicy }}
        contentWidth={width}
        tagsStyles={{
          p: styles.contentText,
          h1: styles.headerText,
          h2: styles.headerText,
          h3: styles.headerText,
          h4: styles.headerText,
          ul: styles.contentText,
          li: styles.contentText,
          strong: { fontFamily: fonts.bold },
          b: { fontFamily: fonts.bold },
        }}
      />
    ),
    [privacyPolicy, width],
  );
  return (
    <TitleBackHeaderContainer isBack title={type === 'terms_and_conditions'
      ?
      "Terms & Conditions"
      :
      type === 'privacy_policy' ? "Privacy Policy" : "Help Support"} containerStyle={{}}>
      {privacyPolicy && renderHTMLMemoized}
    </TitleBackHeaderContainer>
  );
};

export default TermsConditionsScreen;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.secondary,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 10,
  },
  contentText: {
    fontSize: fontSizes.medium,
    color: colors.label,
    fontFamily: fonts.regular,
    marginHorizontal: 20,
    marginBottom: 10,
    lineHeight: 22,
  },
  headerText: {
    fontSize: fontSizes.large,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 8,
  },
});
