import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { imageApi } from '../sevices/api';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore/store';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
}

interface ImageFile {
  file: File;
  title: string;
  preview: string;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onUpload
}) => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const userId = useSelector((state: RootState) => state.appUser.user.userId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({
        file,
        title: '',
        preview: URL.createObjectURL(file)
      }));
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleTitleChange = (index: number, title: string) => {
    setImageFiles(prev =>
      prev.map((img, i) =>
        i === index ? { ...img, title } : img
      )
    );
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (imageFiles.length === 0) {
      setError('Please select at least one image to upload.');
      return;
    }

    if (imageFiles.some(img => !img.title)) {
      setError('Please provide titles for all images.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      imageFiles.forEach((img, index) => {
        formData.append(`images`, img.file);
        formData.append(`titles`, img.title);
      });
      formData.append('userId', userId);

      await imageApi.addImages(formData);
      onUpload();
      onClose();
      
      imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
      setImageFiles([]);
    } catch (err) {
      setError('Failed to upload images.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
    setImageFiles([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Upload Multiple Images</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              cursor: 'pointer',
              textAlign: 'center',
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#eeeeee'
              }
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*"
              multiple
            />
            <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography>Click to upload multiple images</Typography>
          </Paper>

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={2}>
            {imageFiles.map((img, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 1,
                    position: 'relative',
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={() => removeImage(index)}
                    >
                      Close
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      paddingTop: '100%',
                      position: 'relative',
                      mb: 1
                    }}
                  >
                    <Box
                      component="img"
                      src={img.preview}
                      alt={`Preview ${index}`}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter image title"
                    value={img.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    variant="outlined"
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadDialog;