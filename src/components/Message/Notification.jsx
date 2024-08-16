import * as React from "react";
import { RxCross2 } from "react-icons/rx";
import { FaCircleCheck } from "react-icons/fa6";
import "../../styles/Notification.scss";
import { AiFillCloseCircle } from "react-icons/ai";
import LinearProgress from "@mui/material/LinearProgress";

export default function ToastNotification({ notify, notificationType }) {
  const [progress, setProgress] = React.useState(100);
  const [close, setClose] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress <= 0) {
          clearInterval(timer);
          setTimeout(() => {
            setClose(true);
          }, 100);
          return 0;
        }
        return oldProgress - 5;
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, [notificationType, notify]);

  const handleClose = () => {
    setClose(true);
    setTimeout(() => {}, 100);
  };

  return (
    <>
      <div className="notification">
        <div className={!close ? "notification-top" : "hide"}>
          <div
            className={
              notificationType === "success"
                ? "notification-Done"
                : "notification-Error"
            }
          >
            {notificationType === "success" ? (
              <FaCircleCheck />
            ) : (
              <AiFillCloseCircle />
            )}
          </div>
          <p>{notify}</p>
          <div className="notification-close">
            <RxCross2 onClick={handleClose} />
          </div>
          <div className="notification-bottom">
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                width: "290px",
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    notificationType === "success" ? "#0abf30" : "#e24d4c",
                },
                backgroundColor: "transparent",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
