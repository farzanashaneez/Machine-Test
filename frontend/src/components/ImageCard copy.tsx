import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export interface IImage {
  _id?: string;
  userId?: string;
  url: string;
  title: string;
}

interface ImageCardProps {
  image: IImage;
  onEdit: () => void;
  onDelete: () => void;
}

const ImageCard = ({ image, onEdit, onDelete }: ImageCardProps) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    console.log('delet pressd')
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

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
        <IconButton 
          onClick={handleEditClick}
          sx={{ 
            zIndex: 2,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <Edit />
        </IconButton>
        <IconButton 
          onClick={handleDeleteClick}
          sx={{ 
            zIndex: 2,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ImageCard;