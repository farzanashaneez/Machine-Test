import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, CircularProgress } from '@mui/material';
import { imageApi } from '../sevices/api';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore/store';

interface Image {
  _id: string;
  title: string;
  url: string;
}

interface ImageEditDialogProps {
  open: boolean;
  onClose: () => void;
  image: Image | null;
  onEdit: () => void;
}

const ImageEditDialog: React.FC<ImageEditDialogProps> = ({ open, onClose, image, onEdit }) => {
  const [editedImage, setEditedImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const userId = useSelector((state: RootState) => state.appUser.user.userId);


  useEffect(() => {
    if (image) {
      setEditedImage({ ...image });
    }
  }, [image]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedImage((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!editedImage) return;
    setLoading(true);
    setError('');

    try {
      await imageApi.editImage(editedImage._id,{title:editedImage.title,userId:userId})  // Replace with your API endpoint
      onEdit();  
      onClose(); 
    } catch (err) {
      setError('Failed to save changes.');
      console.error('Edit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Image</DialogTitle>
      <DialogContent>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {editedImage && (
          <>
            <TextField
              label="Image Title"
              name="title"
              value={editedImage.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
           
          </>
        )}
        {loading && <CircularProgress />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageEditDialog;
