import React, { useState, useEffect } from 'react';
import { Container, Button } from '@mui/material';
import ImageGrid from '../components/ImageGrid';
import {IImage} from '../components/ImageCard';
import { DragEndEvent } from '@dnd-kit/core';


import ImageUploadDialog from '../components/ImageUploadDialog';
import ImageEditDialog from '../components/ImageEditDialog';

const dummyData = [
    { _id: '1', title: 'Image 1', url: 'https://picsum.photos/200/300?random=1' },
    { _id: '2', title: 'Image 2', url: 'https://picsum.photos/200/300?random=2' },
    { _id: '3', title: 'Image 3', url: 'https://picsum.photos/200/300?random=3' },
    { _id: '4', title: 'Image 4', url: 'https://picsum.photos/200/300?random=4' },
    { _id: '5', title: 'Image 5', url: 'https://picsum.photos/200/300?random=5' },
  ];

const Home = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState<IImage[]|null>(dummyData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImages(dummyData)
    fetchImages();
  }, []);

  // Fetch images from API
  const fetchImages = async () => {
    setLoading(true);
    try {
    //   const response = await axios.get('/api/images');
    //   setImages(response.data);
    
      setImages(dummyData)
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (active.id !== over?.id && images !== null &&over?.id) {
      const oldIndex = images.findIndex((img) => img._id === active.id);
      const newIndex = images.findIndex((img) => img._id === over?.id);
      console.log(oldIndex,newIndex, over?.id)
  
      const newOrder = Array.from(images);
      // const [reorderedItem] = newOrder.splice(oldIndex, 1);
      // newOrder.splice(newIndex, 0, reorderedItem);

      [newOrder[oldIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[oldIndex]];
      setImages(newOrder);
  
      // Here you would typically update the order in your API
      // await updateImageOrderAPI(newOrder);
    }
  };

  // Handle image deletion
  const handleDelete = async (id:string) => {
    try {
    //   await axios.delete(`/api/images/${id}`);  // Replace with your API endpoint
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
        onUpload={fetchImages}  // Refresh the images after upload
      />

      <ImageEditDialog
        open={editOpen}
        image={selectedImage}
        onClose={() => {
          setEditOpen(false);
          setSelectedImage(null);
        }}
        onEdit={fetchImages}  // Refresh the images after editing
      />
    </Container>
  );
};

export default Home;
