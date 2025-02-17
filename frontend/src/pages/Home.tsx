import React, { useState, useEffect } from 'react';
import { Container, Button } from '@mui/material';
import ImageGrid from '../components/ImageGrid';
import {IImage} from '../components/ImageCard';
import { DragEndEvent } from '@dnd-kit/core';


import ImageUploadDialog from '../components/ImageUploadDialog';
import ImageEditDialog from '../components/ImageEditDialog';
import { imageApi } from '../sevices/api';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore/store';



const Home = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState<IImage[]|null>(null);
  const userId = useSelector((state: RootState) => state.appUser.user.userId);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    fetchImages();
  }, []);

  
  const fetchImages = async () => {
    try {
      const response = await imageApi.getUserImages(userId);
       setImages(response.data.reverse());
    console.log("images",response)
      
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
    }
  };

  const handleDragEnd = async(event: DragEndEvent) => {
    const { active, over } = event;
  
    if (active.id !== over?.id && images !== null &&over?.id) {
      const oldIndex = images.findIndex((img) => img._id === active.id);
      const newIndex = images.findIndex((img) => img._id === over?.id);
      console.log(oldIndex,newIndex, over?.id)
  
      const newOrder = Array.from(images);
     
      [newOrder[oldIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[oldIndex]];
      setImages(newOrder);
      const newImageOrder = newOrder.map(img => img._id);

    try {
      await imageApi.reorderImages(newImageOrder.reverse(),userId);
    } catch (error) {
      console.error('Failed to update image order:', error);
     
    }
      
      
    }
  };

  
  const handleDelete = async (id:string) => {
    try {
    await imageApi.deleteImage(id,userId)
     if(images) setImages(images.filter((image) => image._id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setUploadOpen(true)}
        sx={{ mb: 2 }}
      >
        Upload Images
      </Button>

      <ImageGrid
        images={images}
        onDragEnd={handleDragEnd}
        onEdit={(image) => {
          setSelectedImage(image);
          setEditOpen(true);
        }}
        onDelete={handleDelete}
      />

      <ImageUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={fetchImages}  
      />

      <ImageEditDialog
        open={editOpen}
        image={selectedImage}
        onClose={() => {
          setEditOpen(false);
          setSelectedImage(null);
        }}
        onEdit={fetchImages}  
      />
      
    </Container>
  );
};

export default Home;
