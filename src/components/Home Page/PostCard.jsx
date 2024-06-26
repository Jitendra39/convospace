import * as React from "react";
import { styled } from "@mui/material/styles";
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
import ShareIcon from "@mui/icons-material/Share";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../../styles/PostCard.css";
import { format, formatDistanceToNow } from "date-fns";
import { MdFavoriteBorder } from "react-icons/md";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../store/firebaseConfig";
import { SocialMediaContext } from "../../store/GeneralStore";
import { homePageContext } from "../../store/HomePageContext";
import { useNavigate } from "react-router";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function PostCard() {
  const navigate = useNavigate()
  const { currentUser } = React.useContext(SocialMediaContext);
  const [thumbDown, setThumbDown] = React.useState({});
  const [favorite, setFavorite] = React.useState({});
  const [likes, setLikes] = React.useState({});
  const [dislikes, setDislikes] = React.useState({});


  const {postsdata} = React.useContext(homePageContext);
  React.useEffect(() => {
    const initialLikes = {};
    const initialFavorite = {};
    const initialThumbDown = {};
    const initialDislikes = {};

    postsdata.posts.forEach((post) => {
      initialLikes[post.id] = post.likes;
      initialFavorite[post.id] = post.userLikes
        ? post.userLikes.includes(currentUser.uid)
        : false;
      initialThumbDown[post.id] = post.dislikes;
      initialDislikes[post.id] = post.userDislikes
        ? post.userDislikes.includes(currentUser.uid)
        : false;
    });

    setLikes(initialLikes);
    setFavorite(initialFavorite);
    setDislikes(initialDislikes);
    setThumbDown(initialThumbDown);
  }, [postsdata.posts]);

  const handleUpdateLike = async (postId, incrementBy) => {

    const postRef = doc(db, "PostData", postId);
    const updateData = {
      likes: likes[postId] + incrementBy,
    };

    if (incrementBy > 0) {
      updateData.userLikes = arrayUnion(currentUser.uid);
    } else {
      updateData.userLikes = arrayRemove(currentUser.uid);
    }

     updateDoc(postRef, updateData);

    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: prevLikes[postId] + incrementBy,
    }));
  };

  const handleUpdateDislikes = async (postId, incrementBy) => {
    const postRef = doc(db, "PostData", postId);
    const updateData = {
      dislikes: thumbDown[postId] + incrementBy,
    };

    if (incrementBy > 0) {
      updateData.userDislikes = arrayUnion(currentUser.uid);
    } else {
      updateData.userDislikes = arrayRemove(currentUser.uid);
    }

     updateDoc(postRef, updateData);

    setThumbDown((prevThumbDown) => ({
      ...prevThumbDown,
      [postId]: prevThumbDown[postId] + incrementBy,
    }));
  };

  const toggleFavorite = (postId) => {
    const isFavorited = favorite[postId];
    const incrementBy = isFavorited ? -1 : 1;

    setFavorite((prevFavorite) => ({
      ...prevFavorite,
      [postId]: !prevFavorite[postId],
    }));

    if (dislikes[postId]) {
      toggleDislike(postId);
    }

    handleUpdateLike(postId, incrementBy);
  };

  const toggleDislike = (postId) => {
    const isDisliked = dislikes[postId];
    const incrementBy = isDisliked ? -1 : 1;

    setDislikes((prevDislikes) => ({
      ...prevDislikes,
      [postId]: !prevDislikes[postId],
    }));

    if (favorite[postId]) {
      toggleFavorite(postId);
    }

    handleUpdateDislikes(postId, incrementBy);
  };

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

  const handleClickProfile = (id) =>{
    navigate(`/Profile/${id}`);
  }

  return (
    <div className="PostCard">

      {postsdata && postsdata.posts.map((post) => (
        
        <div className="post-card-item" key={post.id}>
          
          <Card sx={{ maxWidth: 570 }}>
            <CardHeader 
                  onClick={() => handleClickProfile(post.uid)} 
              avatar={
                <Avatar alt="avatar" src={post.photoURL} aria-label="recipe" />
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={post.displayName}
              subheader={post.serverTimestamp && dateTime(post.serverTimestamp)}
            />
            {post.type && post.type.includes("image") ? (
              <CardMedia
                component="img"
                className="Card-Image"
                image={post.file}
                alt="Post image"
              />
            ) : (
              <video className="Card-Image" autoPlay muted controls>
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
                  onClick={() => {
                    toggleFavorite(post.id);
                  }}
                >
                  {favorite[post.id] ? (
                    <FavoriteIcon
                      style={{ fontSize: "2.1rem", paddingBottom: "0" }}
                    />
                  ) : (
                    <MdFavoriteBorder
                      style={{ fontSize: "2rem", paddingBottom: "0" }}
                    />
                  )}
                </IconButton>
                <div className="favoriteIcon-count">{likes[post.id]}</div>
              </div>
              <div className="favoriteIcon">
                <IconButton
                  aria-label="thumb down"
                  style={{ paddingBottom: "0" }}
                  onClick={() => {
                    toggleDislike(post.id);
                  }}
                >
                  {dislikes[post.id] ? (
                    <ThumbDownIcon
                      style={{ fontSize: "2.1rem", paddingBottom: "0" }}
                    />
                  ) : (
                    <ThumbDownOffAltIcon
                      style={{ fontSize: "2rem", paddingBottom: "0" }}
                    />
                  )}
                </IconButton>
                <div className="favoriteIcon-count">{thumbDown[post.id]}</div>
              </div>
              <ExpandMore>
                <ShareIcon />
              </ExpandMore>
            </CardActions>
          </Card>
        </div>
      ))}
    </div>
  );
}
