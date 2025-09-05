import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import {fontSizes} from '../../utils/utils';
import { image_url } from '../../utils/api';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';

const {width} = Dimensions.get('window');

interface VideoPlayerProps {
  source: string;
  style?: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({source, style}) => {
 
  
  const videoRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
console.log("source",source);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeoutId = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [showControls, isPlaying]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleVideoLoad = (data: {duration: number}) => {
    setDuration(data.duration);
    setLoading(false);
  };

  const handleProgress = (data: {currentTime: number}) => {
    setCurrentTime(data.currentTime);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    videoRef.current?.seek(0);
    setCurrentTime(0);
  };

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
    setShowControls(true);
  };

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
    setShowControls(true);
  };

  const handleSlide = (value: number) => {
    videoRef.current?.seek(value);
    setCurrentTime(value);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current?.seek(newTime);
    setCurrentTime(newTime);
    setShowControls(true);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current?.seek(newTime);
    setCurrentTime(newTime);
    setShowControls(true);
  };

  const handleFullScreenToggle = () => {
    const seconds = Math.floor(currentTime);
    navigation.navigate(SCREENS.FullScreen, {
      url: image_url + source,
      time: seconds,
    });
    // setShowControls(true);
  };

  const handleVideoPress = () => {
    setShowControls(prev => !prev);
  };

  const renderVideoControls = () => {
    if (!showControls) return null;

    return (
      <View style={styles.videoControls}>
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <Text style={[styles.timeText, {marginRight: 10}]}>
            {formatTime(currentTime)}
          </Text>

          <View style={styles.sliderView}>
            <Slider
              style={styles.slider}
              value={currentTime}
              minimumValue={0}
              maximumValue={duration || 1}
              onValueChange={handleSlide}
              minimumTrackTintColor={colors.primary || '#FF1519'}
              maximumTrackTintColor="#EEF1F4"
              thumbTintColor={colors.primary || '#FF1519'}
            />
          </View>

          <Text style={[styles.timeText, {right: 20}]}>
            {formatTime(duration)}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsRow}>
          <View style={styles.leftControls}>
            {/* Skip Backward */}
            <TouchableOpacity
              onPress={handleSkipBackward}
              style={styles.controlButton}
              activeOpacity={0.7}>
              {/* <IconsSvg name="skipBackIcon" color={colors.white} /> */}
            </TouchableOpacity>

            {/* Play/Pause */}
            <TouchableOpacity
              onPress={handlePlayPause}
              style={styles.controlButton}
              activeOpacity={0.7}>
              <IconsSvg
                name={isPlaying ? 'pauseIconSmall' : 'play'}
                color={colors.white}
              />
            </TouchableOpacity>

            {/* Skip Forward */}
            <TouchableOpacity
              onPress={handleSkipForward}
              style={styles.controlButton}
              activeOpacity={0.7}>
              <IconsSvg name="skipIcon" color={colors.white} />
            </TouchableOpacity>

            {/* Mute Toggle */}
            <TouchableOpacity
              onPress={handleMuteToggle}
              style={styles.controlButton}
              activeOpacity={0.7}>
              <IconsSvg
                name={isMuted ? 'muteAudio' : 'audioIcon'}
                color={isMuted ? colors.orange : colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightControls}>
            {/* Fullscreen Toggle */}
            <TouchableOpacity
              onPress={handleFullScreenToggle}
              style={styles.controlButton}
              activeOpacity={0.7}>
              <IconsSvg name="fullScreenToggleIcon" color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.videoContainer, style]}
      activeOpacity={1}
      onPress={handleVideoPress}>
      <Video
        ref={videoRef}
        source={{uri: image_url+ source}}
        style={styles.video}
        resizeMode="cover"
        paused={!isPlaying}
        muted={isMuted}
        repeat={false}
        onLoad={handleVideoLoad}
        onProgress={handleProgress}
        onEnd={handleVideoEnd}
        onBuffer={() => setLoading(false)}
        onError={error => {
          console.log('Video error:', error);
          setLoading(false);
        }}
      />

      {/* {!isPlaying && !loading && ( */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={handlePlayPause}
        activeOpacity={0.7}>
        {/* <IconsSvg name="play" color={colors.white} /> */}
        <IconsSvg name={isPlaying ? 'pauseIcon' : 'play'} />
      </TouchableOpacity>
      {/* )} */}

      {/* Video Controls */}
      {renderVideoControls()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -30}, {translateY: -10}],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  loadingText: {
    color: colors.white,
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 90,
  },
  videoControls: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    color: colors.white,
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    minWidth: 40,
    textAlign: 'center',
  },
  sliderView: {
    flex: 1,
    marginHorizontal: 10,
  },
  slider: {
    width: '100%',
    height: 20,
    marginHorizontal: Platform.OS === 'ios' ? -4 : -16,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 5,
  },
});

export default VideoPlayer;
