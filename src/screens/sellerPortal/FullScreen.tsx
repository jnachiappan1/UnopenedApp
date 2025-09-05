import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Platform,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {height, width} from '../../utils/utils';
import colors from '../../utils/colors';
import IconsSvg from '../../assets/svg/iconsSvg';

type ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.FullScreen
>;

const FullScreen: React.FC<ScreenProps> = ({navigation, route}) => {
  const {url, time} = route.params;

  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rate, setRate] = useState(1.0);
  const [mute, setMute] = useState(false);
  const [isShowControl, setIsShowControl] = useState(false);
  const videoRef = useRef<any>(null);

  // Get screen dimensions
  const screenData = Dimensions.get('screen');
  const windowData = Dimensions.get('window');

  // For landscape full screen, use the larger dimension as width
  const screenWidth = Math.max(screenData.width, screenData.height);
  const screenHeight = Math.min(screenData.width, screenData.height);

  const handleLoad = (data: {duration: number}) => {
    setDuration(data.duration);
    setLoading(false);

    const startAt = time;
    if (videoRef.current) {
      videoRef.current.seek(startAt);
    }
  };

  const handleProgress = (data: {
    currentTime: React.SetStateAction<number>;
  }) => {
    setCurrentTime(data.currentTime);
  };

  const handleEnd = () => {
    setPaused(true);
    videoRef.current.seek(0);
  };

  const handleSlide = (value: React.SetStateAction<number>) => {
    videoRef.current.seek(value);
    setCurrentTime(value);
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const changeRate = () => {
    setRate(rate === 1.0 ? 2.0 : 1.0);
  };

  const toggleFullScreen = () => {
    navigation.goBack();
  };

  const formatTime = (time: number) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${
        secs < 10 ? '0' : ''
      }${secs}`;
    } else {
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  };

  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      // Cleanup: unlock orientation when component unmounts
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <View style={styles.containerFlex}>
      <TouchableWithoutFeedback
        onPress={() => setIsShowControl(!isShowControl)}>
        <View style={styles.container}>
          <Video
            ref={videoRef}
            source={{
              uri: url,
            }}
            style={[
              styles.video,
              {
                width: screenWidth,
                height: screenHeight,
              },
            ]}
            paused={paused}
            rate={rate}
            muted={mute}
            resizeMode="contain"
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={handleEnd}
            onBuffer={() => {
              setLoading(false);
            }}
            onError={data => {
              console.log('Error..', data);
            }}
          />
          {loading && (
            <View style={styles.controls}>
              <ActivityIndicator
                size="large"
                color="#5DB45B"
                style={styles.loading}
              />
            </View>
          )}
          <View style={styles.controls}>
            {isShowControl && (
              <View style={styles.controlView}>
                {/* Top Controls */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingTop: Platform.OS === 'ios' ? 10 : 0,
                    right: 20,
                  }}>
                  <TouchableOpacity
                    onPress={changeRate}
                    style={styles.controlButton}>
                    <Text style={styles.rateText}>{rate}x</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setMute(!mute)}
                    style={styles.controlButton}>
                    <IconsSvg name={mute ? 'muteAudio' : 'audioIcon'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={toggleFullScreen}
                    style={styles.controlButton}>
                    <IconsSvg name={'fullScreenToggleIcon'} />
                  </TouchableOpacity>
                </View>

                {/* Center Play/Pause Button */}
                <View style={styles.controlCenterView}>
                  <TouchableOpacity
                    onPress={togglePause}
                    style={styles.stopPlayButton}>
                    <IconsSvg
                      name={paused ? 'pauseIconSmall' : 'play'}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </View>

                {/* Bottom Controls - Progress Bar */}
                <View>
                  <View style={styles.progressBar}>
                    <Text style={styles.timeText}>
                      {formatTime(currentTime)}
                    </Text>
                    <View style={styles.sliderView}>
                      <Slider
                        style={{
                          flex: 1,
                          height: 40,
                        }}
                        value={currentTime}
                        minimumValue={0}
                        maximumValue={duration}
                        onValueChange={handleSlide}
                        minimumTrackTintColor="#FF1519"
                        maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                        thumbTintColor="#FF1519"
                      />
                    </View>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default FullScreen;

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    backgroundColor: '#000',
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  controlView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 20,
  },
  controlCenterView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopPlayButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    marginHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 22,
  },
  sliderView: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  rateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  progressBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    marginRight: 30,
    marginHorizontal: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    minWidth: 80,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
});
