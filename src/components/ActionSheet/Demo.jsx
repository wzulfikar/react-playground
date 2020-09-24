import React, { useState } from "react";

import ActionSheet from "./";

const styles = `
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

html,
body,
#root {
  width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  cursor: url('https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/Ad1_-cursor.png') 39 39, auto;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial,
    sans-serif;
  background: #000;
  height: 100%;
}

.action-btn {
  position: fixed;
  z-index: 100;
  bottom: 80px;
  right: 40px;
  height: 48px;
  width: 48px;
  border-radius: 24px;
  background: coral;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:after {
  content: ' ';
  display: block;
  background: #fff;
  height: 20%;
  width: 20%;
  border-radius: 50%;
}

.sheet > div {
  height: 60px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  text-transform: capitalize;
}
`;

const items = ["save item", "open item", "share item", "delete item", "cancel"];
const height = items.length * 60;

export default function BottomSheet() {
  const [open, setOpen] = useState(false);

  console.log("open:", open);

  return (
    <>
      <style>{styles}</style>
      <div onClick={() => setOpen(false)}>
        <img
          src="https://images.pexels.com/photos/1170831/pexels-photo-1170831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
        />
        <img
          src="https://images.pexels.com/photos/1657110/pexels-photo-1657110.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=650&w=940"
          alt=""
        />
      </div>

      <div className="action-btn" onClick={() => setOpen(true)} />

      <ActionSheet
        className="sheet"
        height={height}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {items.map((entry) => (
          <div key={entry} onClick={() => setOpen(false)} children={entry} />
        ))}
      </ActionSheet>
    </>
  );
}
