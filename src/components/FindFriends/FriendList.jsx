import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ChatContext } from "../../store/ChatContext";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { SocialMediaContext } from "../../store/GeneralStore";

function FriendList() {
  const navigate = useNavigate();
  const { userChats, tempChat, temporaryResult} = React.useContext(ChatContext);
  
  const handleSelect = (userInfo) => {
     
   temporaryResult("")

    // navigate(`/Profile/${userInfo}`,{ state: { userInfo } });
    navigate(`/Profile/${userInfo}`);
  };

  const isSmallScreen = useMediaQuery("(max-width: 999px)");
  const isSmallScreen1 = useMediaQuery("(max-width: 768px)");
  return (
    <>
    
      <List
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: isSmallScreen ? "90vw" : "30vw",
          minWidth: isSmallScreen ? (isSmallScreen1 ? "90vw" : "55vw") : "29vw",
          padding: isSmallScreen && "0px",
          margin: isSmallScreen && "0px",
          bgcolor: "background.paper",
          overflowY: "scroll",
          height: isSmallScreen1 ? "calc(80vh - 65px)" : "calc(90vh - 65px)",
        }}
      >
        {tempChat && 
        <React.Fragment>
          <ListItem
            alignItems="flex-start"
            
            onClick={() => handleSelect(tempChat.uid)}
          >
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={tempChat.photoURL} />
            </ListItemAvatar>
            <ListItemText
              primary={tempChat.displayName}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Last Message -
                  </Typography>
                  { " Not Available "}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
}
        {Object.entries(userChats)
          .filter(([id, chat]) => chat && chat.date)
          .sort((a, b) => b[1].date - a[1].date)
          .map(
            ([id, chat]) =>
              chat.userInfo && (
                <React.Fragment key={id}>
                  <ListItem
                    alignItems="flex-start"
                    key={id}
                    onClick={() => handleSelect(chat.userInfo.uid)}
                  >
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={chat.userInfo.photoURL} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.userInfo.displayName}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Last Message -
                          </Typography>
                          {chat.lastMessage?.text
                            ? chat.lastMessage.text
                            : " Not Available "}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              )
          )}
      </List>
    </>
  );
}

export default FriendList;
