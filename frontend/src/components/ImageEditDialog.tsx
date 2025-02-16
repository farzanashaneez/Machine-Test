import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, CircularProgress } from '@mui/material';

interface Image {
  _id: string;
  title: string;
  description: string;
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
    //   await axios.put(`/api/images/${editedImage._id}`, editedImage);  // Replace with your API endpoint
      onEdit();  // Refresh the images after edit
      onClose(); // Close the dialog
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
            <TextField
              label="Image Description"
              name="description"
              value={editedImage.description}
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
