import React from "react";
import { useSpring, animated } from "react-spring";

export default function HelloReactSpring() {
  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 2000 }
  });

  return (
    <div className="bg-gray-200 h-screen flex flex-col justify-center items-center">
      <animated.div style={props} className="text-center">
        <h1 className="font-bold">Hello world!</h1>
        <h2>Start editing to see some magic happen</h2>
      </animated.div>
    </div>
  );
}
