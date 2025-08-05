import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, SvgProps} from 'react-native-svg';

function DropDownArrow({stroke = '#000', ...props}: SvgProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" {...props}>
      <G clipPath="url(#clip0_128_1966)">
        <Path
          d="M5.5 8.25l5.5 5.5 5.5-5.5"
          stroke={stroke ?? '#000'}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_128_1966">
          <Path fill="#fff" d="M0 0H22V22H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default DropDownArrow;
