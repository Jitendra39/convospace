import * as React from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
 
import { format, formatDistanceToNow } from "date-fns";

function UserPost({ post, deletePost}) {

  const dateTime = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const now = new Date();
    const diffInSeconds = (now - date) / 1000;

    if (diffInSeconds < 60) {
      return "Just now";
    }

    if (diffInSeconds < 86400) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    return format(date, "MMMM d, yyyy");
  };
    return (
    <>
 
        <Card sx={{ maxWidth: 570 }}>
          <CardHeader
            avatar={
              <Avatar alt="avatar" src={post.photoURL} aria-label="recipe" />
            }
            action={
              <IconButton aria-label="settings" onClick={() => deletePost(post.id)}>
               { <DeleteForeverIcon/>}
              </IconButton>
            }
            title={post.displayName}
            subheader={dateTime(post.serverTimestamp)}
          />
          {post.type && post.type.includes("image") ? (
            <CardMedia
              component="img"
              className="Card-Image"
              image={post.file}
              alt="Post image"
            />
          ) : (
            <video className="Card-Image" style={{width: '100%'}} autoPlay muted controls>
              <source src={post.file} type="video/mp4" />
            </video>
          )}

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {post.description}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
           
            <div className="favoriteIcon">
              <IconButton
                aria-label="add to favorites"
                style={{ paddingBottom: "0" }}
              >
                <FavoriteIcon
                  style={{ fontSize: "2.1rem", paddingBottom: "0" }}
                />
              </IconButton>
              <div className="favoriteIcon-count">{post.likes}</div>
            </div>
            <div className="favoriteIcon">
              <IconButton
                aria-label="thumb down"
                style={{ paddingBottom: "0" }}
              >
                <ThumbDownIcon
                  style={{ fontSize: "2.1rem", paddingBottom: "0" }}
                />
              </IconButton>
              <div className="favoriteIcon-count">{post.dislikes}</div>
           </div>             
          </CardActions>
        </Card>
       
    </>
  );
}
 

export default UserPost;
