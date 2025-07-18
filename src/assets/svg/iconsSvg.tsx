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
  | 'viewDetailArrow'
  | 'backArrow'
  | 'funds'
  | 'cashOut'
  | 'arrowUpIcon'
  | 'arrowDownIcon'
  | 'addIcon'
  | 'celender'
  | 'uploadIcon'
  | 'scannerIcon'
  | 'cashApp'
  | 'venmo'
  | 'addCard'
  | 'googlePay'
  | 'applePay'
  | 'payPal'
  | 'searchIcon'
  | 'myOrderIcon';

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
    case 'backArrow':
      return (
        <Svg
          width={50}
          height={50}
          viewBox="0 0 50 50"
          fill="none"
          {...props}
        >
          <Rect width={50} height={50} rx={25} fill="#fff" />
          <G
            clipPath="url(#clip0_1_7626)"
            stroke="#000"
            strokeWidth={1.56}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M33.25 25h-16.5M23.5 18.25L16.75 25l6.75 6.75" />
          </G>
          <Defs>
            <ClipPath id="clip0_1_7626">
              <Path fill="#fff" transform="translate(13 13)" d="M0 0H24V24H0z" />
            </ClipPath>
          </Defs>
        </Svg>
      );
    case 'funds':
      return (
        <Svg
          width={25}
          height={24}
          viewBox="0 0 25 24"
          fill="none"
          {...props}
        >
          <Path
            opacity={0.16}
            d="M20.75 13a9 9 0 11-18 0 9 9 0 0118 0z"
            fill="#4D4D4D"
          />
          <Path
            d="M11.75 9.5h1.5a1.5 1.5 0 011.5 1.5m-3-1.5h-1.5a1.5 1.5 0 00-1.5 1.5v.5a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 011.5 1.5v.5a1.5 1.5 0 01-1.5 1.5h-1.5m0-7V8m0 8.5h-1.5a1.5 1.5 0 01-1.5-1.5m3 1.5V18"
            stroke="#4D4D4D"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12.75 4.055A9 9 0 1020.695 12M19.25 2v7m3.5-3.5h-7"
            stroke="#4D4D4D"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'cashOut':
      return (
        <Svg
          width={25}
          height={24}
          viewBox="0 0 25 24"
          fill="none"
          {...props}
        >
          <Path
            opacity={0.16}
            d="M6.25 3h12c1.886 0 2.828 0 3.414.608.586.608.586 1.587.586 3.544s0 2.936-.586 3.543c-.12.125-.26.228-.414.305h-2.606l-.13-.703c-.289-1.576-.434-2.364-1.007-2.83C16.934 7.001 16.11 7 14.463 7h-4.426c-1.647 0-2.47 0-3.044.467-.573.466-.718 1.254-1.008 2.83L5.856 11H3.25a1.501 1.501 0 01-.414-.305c-.586-.606-.586-1.585-.586-3.543 0-1.958 0-2.936.586-3.544C3.422 3 4.364 3 6.25 3z"
            fill="#4D4D4D"
          />
          <Path
            d="M19.185 13.945l-.67-3.648c-.29-1.576-.435-2.364-1.008-2.83C16.934 7.001 16.11 7 14.463 7h-4.426c-1.647 0-2.47 0-3.044.467-.573.466-.718 1.254-1.008 2.83l-.67 3.648c-.6 3.271-.901 4.907.024 5.98C6.264 21 7.974 21 11.392 21h1.716c3.418 0 5.128 0 6.053-1.074.925-1.074.625-2.71.024-5.98v-.001z"
            stroke="#4D4D4D"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d="M12.5 11.2h1.25c.332 0 .65.126.884.352.234.225.366.53.366.848m-2.5-1.2h-1.25c-.332 0-.65.126-.884.352-.234.225-.366.53-.366.848v.4c0 .318.132.623.366.848.235.226.553.352.884.352h2.5c.332 0 .65.126.884.351.234.225.366.53.366.849v.4c0 .318-.132.624-.366.848a1.277 1.277 0 01-.884.352H12.5m0-5.6V10m0 6.8h-1.25c-.332 0-.65-.126-.884-.352A1.176 1.176 0 0110 15.6m2.5 1.2V18"
            stroke="#4D4D4D"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M21.25 11a1.52 1.52 0 00.414-.305c.586-.606.586-1.585.586-3.543 0-1.958 0-2.936-.586-3.544C21.078 3 20.136 3 18.25 3h-12c-1.886 0-2.828 0-3.414.608-.586.608-.586 1.587-.586 3.544s0 2.936.586 3.543c.12.125.258.227.414.305"
            stroke="#4D4D4D"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'arrowUpIcon':
      return (

        <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
          <Rect width={40} height={40} rx={20} fill="#F1F4EC" />
          <G stroke="#31AD52"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M31 10L19 22l-5-6-8 8" />
            <Path d="M31 18v-8h-8" />
          </G>
          <Defs>
            <ClipPath id="clip0_1_6645">
              <Path fill="#fff" transform="translate(8 8)" d="M0 0h24v24H0z" />
            </ClipPath>
          </Defs>
        </Svg>

      );
    case 'arrowDownIcon':
      return (
        <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
          {/* Background Circle */}
          <Rect width={40} height={40} rx={20} fill="#F1F4EC" />
          <G
            stroke="#CB1C1C"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M31 27L19 15l-5 6-8-8" />
            <Path d="M31 21v6h-6" />
          </G>
          <Defs>
            <ClipPath id="clip0_1_6660">
              <Path fill="#fff" transform="translate(8 8)" d="M0 0h24v24H0z" />
            </ClipPath>
          </Defs>
        </Svg>
      );
    case 'addIcon':
      return (
        <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
          <Rect width={40} height={40} rx={20} fill="#F1F4EC" />
          <Path
            d="M20 8a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm-7 12h14m-7-7v14"
            stroke="#31AD52"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'celender':
      return (
        <Svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          {...props}
        >
          <Path
            d="M5.333 1.333v2M10.666 1.333v2M2.333 6.06h11.334M14 5.666v5.667c0 2-1 3.333-3.333 3.333H5.333C3 14.666 2 13.333 2 11.333V5.666c0-2 1-3.333 3.333-3.333h5.334C13 2.333 14 3.666 14 5.666z"
            stroke="#4D4D4D"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M10.463 9.133h.006M10.463 11.133h.006M7.997 9.133h.006M7.997 11.133h.006M5.53 9.133h.005M5.53 11.133h.005"
            stroke="#4D4D4D"
            strokeWidth={1.33333}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'uploadIcon':
      return (
        <Svg width={61} height={60} viewBox="0 0 61 60" fill="none" {...props}>
          <Rect x={0.5} width={60} height={60} rx={30} fill="#EBF9EF" />
          <G
            clipPath="url(#clip0_212_151)"
            stroke="#31AD52"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path d="M28.375 40.625h-5.313a7.438 7.438 0 111.85-14.644M29.438 34.25l4.25-4.25 4.25 4.25M33.688 40.625V30M24.125 30A10.624 10.624 0 1139 39.74" />
          </G>
          <Defs>
            <ClipPath id="clip0_212_151">
              <Path
                fill="#fff"
                transform="translate(13.5 13)"
                d="M0 0H34V34H0z"
              />
            </ClipPath>
          </Defs>
        </Svg>
      );

    case 'scannerIcon':
      return (
        <Svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
          <Rect width={60} height={60} rx={30} fill="#EBF9EF" />
          <G
            clipPath="url(#clip0_208_3859)"
            stroke="#31AD52"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path d="M36 19h5v5M24 41h-5v-5M41 36v5h-5M19 24v-5h5M36 24H24v12h12V24z" />
          </G>
          <Defs>
            <ClipPath id="clip0_208_3859">
              <Path
                fill="#fff"
                transform="translate(14 14)"
                d="M0 0H32V32H0z"
              />
            </ClipPath>
          </Defs>
        </Svg>
      );
    case 'cashApp':
      return (
        <Svg
          width={56}
          height={56}
          viewBox="0 0 56 56"
          fill="none"
          {...props}
        >
          <Rect width={56} height={56} rx={12} fill="#F2F5ED" />
          <Path fill="url(#pattern0_1_6942)" d="M9 9H47V47H9z" />
          <Defs>
            <Pattern
              id="pattern0_1_6942"
              patternContentUnits="objectBoundingBox"
              width={1}
              height={1}
            >
              <Use xlinkHref="#image0_1_6942" transform="scale(.0039)" />
            </Pattern>
            <Image
              id="image0_1_6942"
              width={256}
              height={256}
              preserveAspectRatio="none"
              xlinkHref="data:image/png;base64,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"
            />
          </Defs>
        </Svg>

      );
    case 'venmo':
      return (
        <Svg
          width={56}
          height={56}
          viewBox="0 0 56 56"
          fill="none"
          {...props}
        >
          <Rect width={56} height={56} rx={12} fill="#F2F5ED" />
          <Path fill="url(#pattern0_1_6934)" d="M9 9H47V47H9z" />
          <Defs>
            <Pattern
              id="pattern0_1_6934"
              patternContentUnits="objectBoundingBox"
              width={1}
              height={1}
            >
              <Use xlinkHref="#image0_1_6934" transform="scale(.00362)" />
            </Pattern>
            <Image
              id="image0_1_6934"
              width={276}
              height={276}
              preserveAspectRatio="none"
              xlinkHref="data:image/png;base64,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"
            />
          </Defs>
        </Svg>
      );
    case 'addCard':
      return (
        <Svg
          width={56}
          height={56}
          viewBox="0 0 56 56"
          fill="none"
          {...props}
        >
          <Rect width={56} height={56} rx={12} fill="#F2F5ED" />
          <G
            clipPath="url(#clip0_1_7003)"
            stroke="#000"
            strokeWidth={1.125}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M37 21.25H19a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h18a.75.75 0 00.75-.75V22a.75.75 0 00-.75-.75zM31.75 31.75h3M27.25 31.75h1.5M18.25 25h19.5" />
          </G>
          <Defs>
            <ClipPath id="clip0_1_7003">
              <Path fill="#fff" transform="translate(16 16)" d="M0 0H24V24H0z" />
            </ClipPath>
          </Defs>
        </Svg>
      );
    case 'googlePay':
      return (
        <Svg
          width={56}
          height={56}
          viewBox="0 0 56 56"
          fill="none"
          {...props}
        >
          <Rect width={56} height={56} rx={12} fill="#F2F5ED" />
          <Path
            d="M38.56 28.25c0-.78-.07-1.53-.2-2.25H28v4.255h5.92a5.06 5.06 0 01-2.195 3.32v2.76h3.555c2.08-1.915 3.28-4.735 3.28-8.085z"
            fill="#4285F4"
          />
          <Path
            d="M28 39c2.97 0 5.46-.985 7.28-2.665l-3.555-2.76c-.985.66-2.245 1.05-3.725 1.05-2.865 0-5.29-1.935-6.155-4.535H18.17v2.85A10.996 10.996 0 0028 39z"
            fill="#34A853"
          />
          <Path
            d="M21.845 30.09A6.612 6.612 0 0121.5 28c0-.725.125-1.43.345-2.09v-2.85H18.17A10.995 10.995 0 0017 28c0 1.775.425 3.455 1.17 4.94l3.675-2.85z"
            fill="#FBBC05"
          />
          <Path
            d="M28 21.375c1.615 0 3.065.555 4.205 1.645l3.155-3.155C33.455 18.09 30.965 17 28 17c-4.3 0-8.02 2.465-9.83 6.06l3.675 2.85c.865-2.6 3.29-4.535 6.155-4.535z"
            fill="#EA4335"
          />
        </Svg>
      );
    case 'applePay':
      return (
        <Svg
          width={56}
          height={56}
          viewBox="0 0 56 56"
          fill="none"
          {...props}
        >
          <Rect width={56} height={56} rx={12} fill="#F2F5ED" />
          <Path
            d="M36.908 24.188c-1.599.989-2.587 2.683-2.587 4.565 0 2.118 1.27 4.047 3.199 4.847a12.57 12.57 0 01-1.646 3.388c-1.035 1.46-2.117 2.965-3.716 2.965-1.6 0-2.07-.941-3.951-.941-1.835 0-2.493.988-3.998.988-1.505 0-2.54-1.365-3.716-3.059-1.552-2.353-2.446-5.082-2.493-7.953 0-4.659 3.01-7.153 6.02-7.153 1.6 0 2.917 1.036 3.905 1.036.94 0 2.445-1.083 4.233-1.083a5.615 5.615 0 014.75 2.4zm-5.597-4.376c.8-.941 1.223-2.118 1.27-3.341 0-.142 0-.33-.047-.471a5.407 5.407 0 00-3.527 1.835 5.137 5.137 0 00-1.318 3.247c0 .142 0 .283.047.424.095 0 .236.047.33.047 1.27-.094 2.446-.753 3.245-1.741z"
            fill="#333"
          />
        </Svg>
      );
    case 'payPal':
      return (
        <Svg
          width={56}
          height={56}
          viewBox="0 0 56 56"
          fill="none"
          {...props}
        >
          <Rect width={56} height={56} rx={12} fill="#F2F5ED" />
          <Path
            d="M34.297 21.391c.057-2.953-2.385-5.22-5.743-5.22H21.61a.68.68 0 00-.672.573L18.154 34.09a.55.55 0 00.545.637h4.115l-.643 4.017a.551.551 0 00.546.636h3.352a.652.652 0 00.429-.162c.122-.105.142-.25.168-.41l.984-5.775c.025-.159.106-.366.23-.471.122-.105.23-.162.392-.162h2.05c3.29 0 6.08-2.332 6.59-5.576.36-2.301-.629-4.396-2.615-5.434z"
            fill="#001C64"
          />
          <Path
            d="M23.705 28.33l-1.025 6.483-.644 4.067a.55.55 0 00.546.636h3.548a.679.679 0 00.67-.572l.935-5.91a.677.677 0 01.67-.572h2.089a6.67 6.67 0 006.59-5.636c.361-2.302-.8-4.397-2.787-5.435a5.53 5.53 0 01-.064.732 6.67 6.67 0 01-6.589 5.636h-3.269a.68.68 0 00-.67.572z"
            fill="#0070E0"
          />
          <Path
            d="M22.68 34.813h-4.128a.554.554 0 01-.545-.636l2.783-17.605a.678.678 0 01.67-.572h7.094c3.358 0 5.8 2.438 5.743 5.39a6.214 6.214 0 00-2.893-.687H25.49a.68.68 0 00-.67.572l-1.115 7.055-1.026 6.483z"
            fill="#003087"
          />
        </Svg>
      );
    case 'searchIcon':
      return (
        <Svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          {...props}
        >
          <Path opacity={0.07} d="M19 11a8 8 0 10-16 0 8 8 0 0016 0z"  fill={color || '#777'} />
          <Path
            d="M17 17l4 4m-2-10a8 8 0 10-16 0 8 8 0 0016 0z"
            stroke={color || '#777'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'myOrderIcon':
      return (
        <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
      >
        <Path
          opacity={0.16}
          d="M22 17.161c0 1.383-1.946 2.205-5.837 3.848C14.6 21.67 13.818 22 13 22c-.818 0-1.6-.33-3.163-.99C5.946 19.366 4 18.543 4 17.16V7l9 4.355L22 7v10.161z"
          fill={color || '#777'}
        />
        <Path
          d="M13 22c-.818 0-1.6-.341-3.163-1.024C8.012 20.18 6.616 19.57 5.647 19H2m11 3c.818 0 1.6-.341 3.163-1.024C20.054 19.278 22 18.43 22 17V6.5M13 22V11M4 6.5v3"
          stroke={color || '#777'}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M18.137 4.016L7.867 8.985M2 13h3m-3 3h3m4.326-6.309L6.405 8.278C4.802 7.502 4 7.114 4 6.5c0-.614.802-1.002 2.405-1.778l2.92-1.413C11.13 2.436 12.03 2 13 2c.97 0 1.871.436 3.674 1.309l2.921 1.413C21.198 5.498 22 5.886 22 6.5c0 .614-.802 1.002-2.405 1.778l-2.92 1.413C14.87 10.564 13.97 11 13 11c-.97 0-1.871-.436-3.674-1.309z"
          stroke={color || '#777'}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      );

    default:
      return null;
  }
};
export default IconsSvg;
