import React from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const AnimatedQR = ({ frames, size = 270, quietZone = 20 }) => {
  const [frameIndexState, setFrameIndexState] = React.useState(0);
  const requestRef = React.useRef();
  const animate = (time) => {
    // Change the state according to the animation
    setFrameIndexState((frameIndexState + 1) % frames.length);
    requestRef.current = requestAnimationFrame(animate);
  };
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  });

  return (
    <View style={{ position: "relative", width: size, height: size }}>
      {frames.map((chunk, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            opacity: i === frameIndexState ? 1 : 0,
          }}
        >
          <QRCode value={chunk} ecl="M" size={size} quietZone={quietZone} />
        </View>
      ))}
    </View>
  );
};

export default AnimatedQR;
