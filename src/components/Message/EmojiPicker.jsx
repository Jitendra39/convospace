import React from "react";
import Picker from "emoji-picker-react";

function EmojiPicker({ setEmoji, setShowEmojiPicker }) {
  const onEmojiClick = (event, emojiObject) => {
    setEmoji(emojiObject.target.src);
    "emoji objerct =", emojiObject;
    setShowEmojiPicker(false);
  };

  return (
    <div
      style={{
        maxWidth: "150px",
        position: "sticky",
        bottom: "0px",
        margin: "auto",
      }}
    >
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
}

export default EmojiPicker;
