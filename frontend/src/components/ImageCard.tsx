import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Button, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AlertModal from './AlertModal';

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
  dragHandleRef?: (el: HTMLElement | null) => void;
  dragHandleProps?: Record<string, any>;
  isDragging?: boolean;
}

const ImageCard = ({
  image,
  onEdit,
  onDelete,
  dragHandleRef,
  dragHandleProps,
  isDragging
}: ImageCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirm = () => {
    console.log('Confirmed');
    onDelete();

    handleCloseModal();
    // Add your confirmation logic here
  };
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true)
        // onDelete();
    
  };

  return (
    <Card style={{ position: 'relative', cursor: isDragging ? 'grabbing' : 'grab' }}>
      <div
        ref={dragHandleRef}
        {...dragHandleProps}
        style={{ position: 'absolute', inset: 0, pointerEvents: isDragging ? 'none' : 'auto' }}
      ></div>
      <CardMedia
        component="img"
        height="200"
        image={image.url}
        alt={image.title}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {image.title}
        </Typography>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleEditClick}
            startIcon={<Edit />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDeleteClick}
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </div>
      </CardContent>
      <AlertModal
        open={isModalOpen}
        title="Delete"
        content="Do you want to continue?"
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </Card>
  );
};

export default ImageCard;