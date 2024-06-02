import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../../styles/PostCard.css'
import { TbThumbDownFilled } from 'react-icons/tb';
import { MdFavoriteBorder } from 'react-icons/md';

function CreatPost() {
  const [thumbDown, setThumbDown] = React.useState(false);
  const [Favorite, setFavorite] = React.useState(false)
 
 
  return (
    <div>
       <Card sx={{ maxWidth: 570 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
       <CardMedia
        component="img"
        className='Card-Image'
    
        image= "https://t4.ftcdn.net/jpg/05/65/22/41/240_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg"
        alt="Paella dish"
      /> <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
      {/* <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={() => {setFavorite(!Favorite)}}>
         {Favorite ? <FavoriteIcon /> : <MdFavoriteBorder/> }
        </IconButton>
        <IconButton aria-label="share" onClick={() =>{setThumbDown(!thumbDown)}}>
         {!thumbDown ? <ThumbDownOffAltIcon/> : <ThumbDownIcon/>}
        </IconButton>
        <ExpandMore
          // expand={expanded}
          // onClick={handleExpandClick}
          // aria-expanded={expanded}
          // aria-label="show more"
        >
          <ShareIcon />
        </ExpandMore> */}
      {/* </CardActions>
       */}
    </Card>

    </div>
  )
}

export default CreatPost