import React from "react";
import { BiSend } from "react-icons/bi";
import { RiMicLine } from "react-icons/ri";
import waveformGif from "../../assets/waveform-10016798-8157897.gif";
function InputMessage({
  setText,
  speechRecognition,
  micSVG,
  handleSend,
  text,
}) {
  return (
    <>
      <div className="conversation-form-group">
        <textarea
          className="conversation-form-input"
          rows="1"
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          type="button"
          className="conversation-form-record"
          onClick={speechRecognition}
        >
          {micSVG ? (
            <RiMicLine className="ri-mic-line" />
          ) : (
            <img src={waveformGif} alt="mic" className="waveFormGif" />
          )}
        </button>
      </div>
      <button
        type="button"
        className="conversation-form-button conversation-form-submit"
        onClick={() => handleSend()}
      >
        <BiSend className="ri-send-plane-2-line" />
      </button>
    </>
  );
}

export default InputMessage;
