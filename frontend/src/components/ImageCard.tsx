
export  interface IImage{
    _id?:string,
    userId?: string,
    url: string,
    title:string
}

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ImageCard = ({ image, onEdit, onDelete }:{image:IImage,onEdit:()=>void,onDelete:()=>void}) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={image.url}
        alt={image.title}
      />
      <CardContent>
        <Typography variant="h6">{image.title}</Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={onEdit}>
          <Edit />
        </IconButton>
        <IconButton onClick={onDelete}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ImageCard;

