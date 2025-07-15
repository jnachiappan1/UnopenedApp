/* eslint-disable react-native/no-inline-styles */
import { ColorValue, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Image,
  Path,
  Pattern,
  Rect,
  Use,
} from 'react-native-svg';

export type IconName =
  | 'box'
  | 'salesIcon'
  | 'walletIcon'
  | 'addProductIcon'
  | 'homeIcon'
  | 'productListIcon'
  | 'leftArrow'
  | 'downArrow'
  | 'search'
  | 'success'
  | 'notificationIcon'
  | 'addUser'
  | 'productListPrimaryIcon'
  | 'pendingIcon'
  | 'boxIcon'
  | 'walletPrimaryIcon'
  | 'viewDetailArrow';

export interface IconsSvgProps {
  name: IconName;
  color?: ColorValue | undefined;
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const IconsSvg = (props: IconsSvgProps) => {
  const { name, color, height, width, onPress } = props;
  switch (name) {
    case 'box':
      return (
        <Svg width={35} height={36} viewBox="0 0 35 36" fill="none" {...props}>
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.394 1.882A1577.58 1577.58 0 015.378 5.65C3.141 6.693 1.31 7.59 1.31 7.643c0 .116 6.872 3.43 7.112 3.43.148 0 6.889-3.3 13.632-6.673l2.458-1.23-3.424-1.59C19.204.707 17.59-.004 17.502 0c-.088.005-1.937.852-4.108 1.882zm9.264 4.921a1602.14 1602.14 0 01-8.015 3.946l-3.503 1.708 3.1 1.53c1.706.84 3.21 1.523 3.343 1.518.133-.006 2.525-1.123 5.317-2.483l7.69-3.747c1.438-.7 2.76-1.32 2.94-1.378.179-.058.325-.161.325-.23 0-.127-6.302-3.115-6.55-3.106-.075.002-2.166 1.012-4.647 2.242zm-22.15 11.4c.003 5.263.061 9.658.127 9.766.106.172 2.034 1.144 6.556 3.306.709.34 3.165 1.541 5.458 2.671C14.94 35.076 16.845 36 16.878 36c.033 0 .058-4.38.055-9.735l-.006-9.734-3.067-1.467a218.863 218.863 0 00-3.216-1.52c-.089-.032-.15.923-.15 2.32v2.375l-1.37-.687-1.37-.687V12.114l-2.456-1.19a433.202 433.202 0 00-3.628-1.74L.5 8.635l.007 9.569zm25.936-5.655c-4.386 2.142-8.047 3.92-8.136 3.952-.156.056-.29 19.5-.135 19.5.103 0 1.816-.822 7.546-3.62 2.836-1.384 5.972-2.907 6.968-3.384l1.813-.867v-9.75c0-5.363-.018-9.745-.04-9.737-.022.007-3.63 1.765-8.016 3.906zm-.646 17.709c-.002.367-.125.505-.685.766-.376.175-1.752.853-3.06 1.508l-2.376 1.19v-.499c0-.485.079-.537 2.94-1.943 1.618-.794 2.995-1.45 3.062-1.457.066-.007.12.189.119.435z"
            fill="#31AD52"
          />
        </Svg>
      );
    case 'walletIcon':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
          <Path
            opacity={0.2}
            d="M19 12h2v4h-2c-.465 0-.698 0-.888-.051a1.5 1.5 0 01-1.06-1.06C17 14.697 17 14.464 17 14s0-.697.051-.888a1.5 1.5 0 011.06-1.06C18.303 12 18.536 12 19 12zm-5-9H5a2 2 0 100 4h13c0-.93 0-1.395-.102-1.776a3 3 0 00-2.121-2.122C15.395 3 14.93 3 14 3z"
            fill={color || '#777'}
          />
          <Path
            d="M14 3H5a2 2 0 100 4h13c0-.93 0-1.395-.102-1.776a3 3 0 00-2.121-2.122C15.395 3 14.93 3 14 3z"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M3 5v10c0 2.828 0 4.243.879 5.121C4.757 21 6.172 21 9 21h6c2.828 0 4.243 0 5.121-.879C21 19.243 21 17.828 21 15v-2c0-2.828 0-4.243-.879-5.121C19.243 7 17.828 7 15 7H7"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M21 12h-2c-.465 0-.698 0-.888.051a1.5 1.5 0 00-1.06 1.06C17 13.303 17 13.536 17 14s0 .697.051.888a1.5 1.5 0 001.06 1.06c.191.052.424.052.889.052h2"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'salesIcon':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
          <Path
            opacity={0.16}
            d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12z"
            fill={color || '#777'}
          />
          <Path
            d="M7 18v-2m5 2v-3m5 3v-5"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d="M5.992 11.486c2.155.072 7.042-.253 9.822-4.665m-1.822-.533l1.876-.302c.228-.029.564.152.647.367l.495 1.638"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12z"
            stroke={color || '#777'}
            strokeWidth={1.5}
          />
        </Svg>
      );

    case 'addProductIcon':
      return (
        <Svg
          width={26}
          height={26}
          viewBox="0 0 24 24"
          fill="none"
          {...props}
        >
          <Path
            opacity={0.16}
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z"
            fill="#fff"
          />
          <Path
            d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m6.909-9.513A10 10 0 006.122 3.91M3.909 6.122A10 10 0 002.487 8.91M12 8v8m4-4H8"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'productListIcon':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
          <Path
            opacity={0.16}
            d="M11.53 22h-1.06c-3.992 0-5.989 0-7.23-1.172C2 19.657 2 17.771 2 14v-4c0-3.771 0-5.657 1.24-6.828C4.481 2 6.478 2 10.47 2H16c.16 0 .317.01.472.028A5 5 0 1020 11v3.419c-.002 3.493-.047 5.282-1.24 6.41C17.519 22 15.522 22 11.53 22z"
            fill={color || '#777'}
          />
          <Path
            d="M15 7.5s.5 0 1 1c0 0 1.588-2.5 3-3"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M22 7a5 5 0 11-10 0 5 5 0 0110 0z"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d="M10.4 2.021c-2.499-.105-4.836.182-4.836.182-1.219.087-3.554.77-3.554 4.761 0 3.957-.026 8.835 0 10.78 0 1.188.735 3.96 3.281 4.108 3.095.18 8.67.218 11.228 0 .684-.04 2.964-.577 3.252-3.057.299-2.569.24-4.355.24-4.78"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M7 13h4m-4 4h8"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'homeIcon':
      return (
        <Svg width={width || 24} height={height || 24} viewBox="0 0 24 24" fill="none" onPress={onPress} {...props}>
          <Path
            opacity={0.2}
            d="M12.892 2.81l8.596 6.785A1.347 1.347 0 0120.653 12H20v3.5c0 2.828 0 4.243-.879 5.121-.825.826-2.123.876-4.621.879V17c0-.935 0-1.402-.201-1.75a1.5 1.5 0 00-.549-.549c-.348-.201-.815-.201-1.75-.201s-1.402 0-1.75.201a1.5 1.5 0 00-.549.549c-.201.348-.201.815-.201 1.75v4.5c-2.498-.003-3.796-.053-4.621-.879C4 19.743 4 18.328 4 15.5V12h-.653a1.347 1.347 0 01-.835-2.405l8.596-6.785a1.44 1.44 0 011.784 0z"
            fill={color || '#777'}
          />
          <Path
            d="M12.892 2.81l8.596 6.785A1.347 1.347 0 0120.653 12H20v3.5c0 2.828 0 4.243-.879 5.121-.878.879-2.293.879-5.121.879h-4c-2.828 0-4.243 0-5.121-.879C4 19.743 4 18.328 4 15.5V12h-.653a1.347 1.347 0 01-.835-2.405l8.596-6.785a1.44 1.44 0 011.784 0z"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M14.5 21.5V17c0-.935 0-1.402-.201-1.75a1.5 1.5 0 00-.549-.549c-.348-.201-.815-.201-1.75-.201s-1.402 0-1.75.201a1.5 1.5 0 00-.549.549c-.201.348-.201.815-.201 1.75v4.5"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'success':
      return (
        <Svg width={72} height={72} viewBox="0 0 72 72" fill="none" {...props}>
          <Rect
            x={0.5}
            y={0.5}
            width={71}
            height={71}
            rx={35.5}
            stroke="#BABDB7"
          />
          <G
            clipPath="url(#clip0_24_682)"
            stroke="#000"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M24.51 47.49c-1.438-1.437-.485-4.457-1.216-6.226-.76-1.827-3.544-3.31-3.544-5.264 0-1.953 2.784-3.438 3.544-5.264.731-1.767-.222-4.79 1.215-6.227 1.438-1.437 4.46-.484 6.227-1.215 1.834-.76 3.31-3.544 5.264-3.544 1.953 0 3.438 2.784 5.264 3.544 1.769.731 4.79-.222 6.227 1.215 1.437 1.438.484 4.458 1.215 6.227.76 1.834 3.544 3.31 3.544 5.264 0 1.953-2.784 3.438-3.544 5.264-.731 1.769.222 4.79-1.215 6.227-1.438 1.437-4.458.484-6.227 1.215-1.827.76-3.31 3.544-5.264 3.544-1.953 0-3.438-2.784-5.264-3.544-1.767-.731-4.79.222-6.227-1.215z" />
            <Path d="M29.75 37.25L33.5 41l8.75-8.75" />
          </G>
          <Defs>
            <ClipPath id="clip0_24_682">
              <Path
                fill="#fff"
                transform="translate(16 16)"
                d="M0 0H40V40H0z"
              />
            </ClipPath>
          </Defs>
        </Svg>
      );
    case 'search':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11.581 20.163C6.851 20.163 3 16.312 3 11.58 3 6.851 6.851 3 11.581 3c4.73 0 8.582 3.851 8.582 8.581 0 4.73-3.851 8.582-8.582 8.582zm0-15.907c-4.043 0-7.325 3.29-7.325 7.325 0 4.036 3.282 7.326 7.325 7.326 4.044 0 7.326-3.29 7.326-7.326 0-4.035-3.282-7.325-7.326-7.325zM20.372 21a.62.62 0 01-.444-.184l-1.674-1.675a.632.632 0 010-.887.632.632 0 01.887 0l1.675 1.674a.632.632 0 010 .888.62.62 0 01-.444.184z"
            fill={color ? color : '#7E7585'}
          />
        </Svg>
      );
    case 'leftArrow':
      return (
        <Svg width={50} height={50} viewBox="0 0 50 50" fill="none" {...props}>
          <Rect width={50} height={50} rx={25} fill="#fff" />
          <G
            clipPath="url(#clip0_13_982)"
            stroke="#000"
            strokeWidth={1.56}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M33.25 25h-16.5M23.5 18.25L16.75 25l6.75 6.75" />
          </G>
          <Defs>
            <ClipPath id="clip0_13_982">
              <Path
                fill="#fff"
                transform="translate(13 13)"
                d="M0 0H24V24H0z"
              />
            </ClipPath>
          </Defs>
        </Svg>
      );
    case 'downArrow':
      return (
        <Svg width={20} height={21} viewBox="0 0 20 21" fill="none" {...props}>
          <G clipPath="url(#clip0_112_129)">
            <Path
              d="M16.25 8L10 14.25 3.75 8"
              stroke="#000"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
          <Defs>
            <ClipPath id="clip0_112_129">
              <Path fill="#fff" transform="translate(0 .5)" d="M0 0H20V20H0z" />
            </ClipPath>
          </Defs>
        </Svg>
      );
    case 'notificationIcon':
      return (
        <Svg
          width={52}
          height={52}
          viewBox="0 0 52 52"
          fill="none"
          {...props}
        >
          <Rect width={52} height={52} rx={26} fill="#fff" />
          <Path
            d="M25.997 24.497a.731.731 0 01-.725-.727v-3.228c0-.398.329-.728.725-.728.397 0 .726.33.726.728v3.228a.725.725 0 01-.726.727z"
            fill="#21252B"
          />
          <Path
            d="M26.017 34.028c-2.495 0-4.98-.398-7.35-1.193-.88-.29-1.547-.92-1.837-1.716-.29-.795-.193-1.706.28-2.501l1.229-2.056c.27-.455.512-1.309.512-1.842v-2.036c0-3.965 3.21-7.184 7.166-7.184 3.955 0 7.165 3.219 7.165 7.184v2.036c0 .524.242 1.387.512 1.842l1.228 2.056c.455.756.532 1.658.233 2.482a2.867 2.867 0 01-1.79 1.735 22.839 22.839 0 01-7.348 1.193zm0-17.064c-3.153 0-5.715 2.57-5.715 5.73v2.036c0 .785-.31 1.92-.716 2.589l-1.228 2.065c-.251.417-.31.863-.164 1.25.145.388.474.679.938.834a21.92 21.92 0 0013.789 0c.416-.136.735-.446.88-.853a1.419 1.419 0 00-.116-1.231l-1.228-2.056c-.406-.669-.716-1.803-.716-2.588v-2.036c-.01-3.17-2.572-5.74-5.724-5.74z"
            fill="#21252B"
          />
          <Path
            d="M25.997 36.5a3.967 3.967 0 01-3.945-3.956h1.45a2.516 2.516 0 002.495 2.502 2.504 2.504 0 002.495-2.502h1.45a3.955 3.955 0 01-3.945 3.956z"
            fill="#21252B"
          />
        </Svg>
      );
    case 'addUser':
      return (
        <Svg
        width={22}
        height={22}
        viewBox="0 0 22 22"
        fill="none"
        {...props}
      >
        <Path
          opacity={0.2}
          d="M11 6.875a3.208 3.208 0 11-6.416 0 3.208 3.208 0 016.416 0zm-9.167 9.887c0 .869.762 1.572 1.703 1.572h8.512c.941 0 1.702-.703 1.702-1.572 0-2.17-1.905-3.928-4.256-3.928H6.089c-2.35 0-4.256 1.759-4.256 3.928z"
          fill="#31AD52"
        />
        <Path
          d="M11 6.875a3.208 3.208 0 11-6.416 0 3.208 3.208 0 016.416 0z"
          stroke="#31AD52"
          strokeWidth={1.375}
        />
        <Path
          d="M12.375 10.084a3.208 3.208 0 000-6.417"
          stroke="#31AD52"
          strokeWidth={1.375}
          strokeLinecap="round"
        />
        <Path
          d="M12.048 18.333H3.536c-.94 0-1.703-.703-1.703-1.571 0-2.17 1.906-3.929 4.256-3.929h3.405a4.493 4.493 0 012.554.786"
          stroke="#31AD52"
          strokeWidth={1.375}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M17.417 12.833v5.5m2.75-2.75h-5.5"
          stroke="#31AD52"
          strokeWidth={1.375}
          strokeLinecap="round"
        />
      </Svg>
      );
    case 'productListPrimaryIcon':
      return (
        <Svg
        width={41}
        height={40}
        viewBox="0 0 41 40"
        fill="none"
        {...props}
      >
        <Path
          d="M20.5.5C31.27.5 40 9.23 40 20s-8.73 19.5-19.5 19.5S1 30.77 1 20 9.73.5 20.5.5z"
          stroke="#E0E0E0"
        />
        <Path
          opacity={0.16}
          d="M20.53 30h-1.06c-3.992 0-5.989 0-7.23-1.172C11 27.657 11 25.771 11 22v-4c0-3.771 0-5.657 1.24-6.828C13.481 10 15.478 10 19.47 10H25c.16 0 .317.01.472.028A5 5 0 1029 19v3.419c-.002 3.493-.047 5.282-1.24 6.41C26.519 30 24.522 30 20.53 30z"
          fill="#31AD52"
        />
        <Path
          d="M24 15.5s.5 0 1 1c0 0 1.588-2.5 3-3"
          stroke="#31AD52"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M31 15a5 5 0 11-10 0 5 5 0 0110 0z"
          stroke="#31AD52"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M19.4 10.021c-2.499-.105-4.836.182-4.836.182-1.219.087-3.554.77-3.554 4.761 0 3.957-.026 8.835 0 10.78 0 1.188.735 3.96 3.281 4.108 3.095.18 8.67.218 11.228 0 .684-.04 2.964-.577 3.252-3.057.299-2.569.24-4.355.24-4.78"
          stroke="#31AD52"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 21h4m-4 4h8"
          stroke="#31AD52"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
      );
    case 'pendingIcon':
      return (
        <Svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        fill="none"
        {...props}
      >
        <Path
          d="M20 .5C30.77.5 39.5 9.23 39.5 20S30.77 39.5 20 39.5.5 30.77.5 20 9.23.5 20 .5z"
          stroke="#E0E0E0"
        />
        <Path
          d="M17.727 10c-3.26 0-4.892 0-6.024.798a4.14 4.14 0 00-.855.805C10 12.669 10 14.203 10 17.273v2.545c0 2.963 0 4.445.469 5.628.754 1.903 2.348 3.403 4.37 4.113 1.257.441 2.83.441 5.98.441 1.798 0 2.698 0 3.416-.252 1.155-.406 2.066-1.263 2.497-2.35.268-.676.268-1.523.268-3.216V23.5"
          stroke="#31AD52"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          opacity={0.2}
          d="M10 17.273v2.545c0 1.148 0 1.722.272 2.19.169.288.432.552.72.72.468.272 1.057.272 2.233.272H14.5c.943 0 1.414 0 1.707.293.293.293.293.764.293 1.707v1.274c0 1.701 0 2.552.585 3.138.585.586 1.402.586 3.035.588h.698c1.8 0 2.699 0 3.417-.252 1.155-.406 2.066-1.263 2.497-2.35.268-.676.268-1.523.268-3.216v-4.598a5 5 0 11-3.352-9.399C22.526 10 21.038 10 19 10h-1.273c-3.26 0-4.892 0-6.024.798a4.14 4.14 0 00-.855.805C10 12.669 10 14.203 10 17.273z"
          fill="#31AD52"
        />
        <Path
          d="M23 15.5s.5 0 1 1c0 0 1.588-2.5 3-3"
          stroke="#31AD52"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M30 15a5 5 0 11-10 0 5 5 0 0110 0z"
          stroke="#31AD52"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M10 20a3.333 3.333 0 003.333 3.333c.666 0 1.451-.116 2.098.057a1.67 1.67 0 011.179 1.18c.173.647.057 1.432.057 2.098A3.333 3.333 0 0020 30"
          stroke="#31AD52"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      );
    case 'boxIcon':
      return (
        <Svg
      width={41}
      height={40}
      viewBox="0 0 41 40"
      fill="none"
      {...props}
    >
      <Path
        d="M20.5.5C31.27.5 40 9.23 40 20s-8.73 19.5-19.5 19.5S1 30.77 1 20 9.73.5 20.5.5z"
        stroke="#E0E0E0"
      />
      <Path
        opacity={0.16}
        d="M30 25.161c0 1.383-1.946 2.205-5.837 3.848C22.6 29.67 21.818 30 21 30c-.818 0-1.6-.33-3.163-.99C13.946 27.366 12 26.543 12 25.16V15l9 4.355L30 15v10.161z"
        fill="#31AD52"
      />
      <Path
        d="M21 30c-.818 0-1.6-.33-3.163-.99C13.946 27.366 12 26.543 12 25.16V15m9 15c.818 0 1.6-.33 3.163-.99C28.054 27.366 30 26.543 30 25.16V15m-9 15V19.355M15 20l2 1m9-9l-10 5m1.326.691l-2.921-1.413C12.802 15.502 12 15.114 12 14.5c0-.614.802-1.002 2.405-1.778l2.92-1.413C19.13 10.436 20.03 10 21 10c.97 0 1.871.436 3.674 1.309l2.921 1.413C29.198 13.498 30 13.886 30 14.5c0 .614-.802 1.002-2.405 1.778l-2.92 1.413C22.87 18.564 21.97 19 21 19c-.97 0-1.871-.436-3.674-1.309z"
        stroke="#31AD52"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
      );
    case 'walletPrimaryIcon':
      return (
        <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <Path
        d="M20 .5C30.77.5 39.5 9.23 39.5 20S30.77 39.5 20 39.5.5 30.77.5 20 9.23.5 20 .5z"
        stroke="#E0E0E0"
      />
      <Path
        opacity={0.2}
        d="M27 20h2v4h-2c-.465 0-.698 0-.888-.051a1.5 1.5 0 01-1.06-1.06C25 22.697 25 22.464 25 22s0-.697.051-.888a1.5 1.5 0 011.06-1.06C26.303 20 26.536 20 27 20zm-5-9h-9a2 2 0 000 4h13c0-.93 0-1.395-.102-1.776a3 3 0 00-2.121-2.122C23.395 11 22.93 11 22 11z"
        fill="#31AD52"
      />
      <Path
        d="M22 11h-9a2 2 0 000 4h13c0-.93 0-1.395-.102-1.776a3 3 0 00-2.121-2.122C23.395 11 22.93 11 22 11z"
        stroke="#31AD52"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 13v10c0 2.828 0 4.243.879 5.121C12.757 29 14.172 29 17 29h6c2.828 0 4.243 0 5.121-.879C29 27.243 29 25.828 29 23v-2c0-2.828 0-4.243-.879-5.121C27.243 15 25.828 15 23 15h-8"
        stroke="#31AD52"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M29 20h-2c-.465 0-.698 0-.888.051a1.5 1.5 0 00-1.06 1.06C25 21.303 25 21.536 25 22s0 .697.051.888a1.5 1.5 0 001.06 1.06c.191.052.424.052.889.052h2"
        stroke="#31AD52"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
      );
    case 'viewDetailArrow':
      return (
        <Svg
        width={26}
        height={26}
        viewBox="0 0 26 26"
        fill="none"
        {...props}
      >
        <Rect x={0.5} y={0.5} width={25} height={25} rx={12.5} stroke="#E0E0E0" />
        <G
          clipPath="url(#clip0_1_1209)"
          stroke="#333"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M9 17l8-8M10.5 9H17v6.5" />
        </G>
        <Defs>
          <ClipPath id="clip0_1_1209">
            <Path fill="#fff" transform="translate(5 5)" d="M0 0H16V16H0z" />
          </ClipPath>
        </Defs>
      </Svg>
      );
    default:
      return null;
  }
};
export default IconsSvg;
