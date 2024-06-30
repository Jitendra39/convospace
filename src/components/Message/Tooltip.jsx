import {
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import React from "react";

function Tooltip({
  fileInputRef,
  handleFileInputChange,
  handleInputFile,
  open,
  handleClose,
  handleOpen,
  actions,
  handleGameState,
}) {
  return (
    <div>
      <Backdrop open={open} className="conversation-form-button" />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{
          position: "absolute",
          bottom: 0,
          right: -10,
          "& .MuiFab-primary": {
            width: 40,
            height: 40,
          },
          "& .MuiSpeedDialIcon-icon": {},
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => {
          if (action.name === "Gallery") {
            return (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={handleInputFile}
              />
            );
          }
          if (action.name === "Video") {
            return (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={handleInputFile}
              />
            );
          }
          if (action.name === "Game") {
            return (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={handleGameState}
              />
            );
          }

          return (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={handleClose}
            />
          );
        })}
      </SpeedDial>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
    </div>
  );
}

export default Tooltip;
