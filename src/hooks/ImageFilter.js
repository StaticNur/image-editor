import React, { useEffect } from 'react';
import Konva from 'konva';

const ImageFilter = ({ imageRef, imageSrc, selectedFilter }) => {
  useEffect(() => {
    console.log(selectedFilter);
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      if (imageRef.current) {
        imageRef.current.image(img);
        applyFilter();
        imageRef.current.getLayer().batchDraw();
      }
    };
  }, [imageSrc]);

  const applyFilter = () => {
    console.log(selectedFilter);
    if (imageRef.current) {
      const imageNode = imageRef.current;

      // Применение фильтров
      switch (selectedFilter) {
        case 'grayscale':
          imageNode.filters([Konva.Filters.Grayscale]);
          break;
        case 'sepia':
          imageNode.filters([Konva.Filters.Sepia]);
          break;
        case 'vintage':
          imageNode.filters([Konva.Filters.Sepia, Konva.Filters.Contrast, Konva.Filters.HSL]);
          imageNode.contrast(-0.1);
          imageNode.saturation(-0.3);
          imageNode.hue(20);
          break;
        default:
          imageNode.filters([]);
      }

      imageNode.cache();
      imageNode.getLayer().batchDraw();
    }
  };

  useEffect(() => {
    console.log(selectedFilter);
    applyFilter();
  }, [selectedFilter]);
  return null;
};

export default ImageFilter;
