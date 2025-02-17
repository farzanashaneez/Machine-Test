import React, { useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { DndContext, DragStartEvent, DragOverlay, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import ImageCard, { IImage } from './ImageCard';

interface ImageGridProps {
  images: IImage[] | null;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (image: any) => void;
  onDelete: (imageId: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onDragEnd, onEdit, onDelete }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Grid container spacing={2} padding={2}>
        {images && images.map((image, index) => (
          <DraggableDroppableItem
            key={image?._id}
            image={image}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Grid>
      <DragOverlay>
        {activeId && images ? (
          <div style={{ transform: 'scale(1.05)', opacity: 0.8 }}>
            <ImageCard
              image={images.find(img => img._id === activeId)!}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragging={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const DraggableDroppableItem: React.FC<any> = ({ image, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging
  } = useDraggable({
    id: image?._id,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: image?._id,
  });

  const setDragHandleRef = (el: HTMLElement | null) => {
    setDraggableRef(el);
  };

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      ref={setDroppableRef}
      style={{ opacity: isDragging ? 0.5 : 1, transition: 'opacity 0.3s' }}
    >
      <ImageCard
        image={image}
        onEdit={() => onEdit(image)}
        onDelete={() => onDelete(image?._id)}
        dragHandleRef={setDragHandleRef}
        dragHandleProps={{ ...listeners, ...attributes }}
        isDragging={isDragging}
      />
    </Grid>
  );
};

export default ImageGrid;