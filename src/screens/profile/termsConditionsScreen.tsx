import { StyleSheet} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import { showLoader } from '../../components/loader/loader';
import RenderHTML from 'react-native-render-html';
import { getLegalcontent } from '../../utils/apiAction';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';

type TermsConditionsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.TermsConditionsScreen
>;

const TermsConditionsScreen: React.FC<TermsConditionsScreenProps> = ({ navigation,route }) => {
  const {type} = route.params;
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
  const renderHTMLMemoized = useMemo(
    () => (
      <RenderHTML
        source={{html: privacyPolicy}}
        contentWidth={300}
        tagsStyles={{
          p: styles.contentText,
          h1: styles.contentText,
          h3: styles.contentText,
          ul: styles.contentText,
        }}
      />
    ),
    [privacyPolicy],
  );
  return (
    <TitleBackHeaderContainer isBack title={"Terms & Conditions"} containerStyle={{}}>
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
  },
});
