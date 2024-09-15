import { useEffect } from 'react';

export const useImageUploader = (imageSrc, setInitialImage, modalVisible, fileInputRef, dropAreaRef, canvasRef,
   setImageDimensions, setImageKonva, setImageSrc, setShowImageHolder, setModalVisible, ) => {

  useEffect(() => {
    if (imageSrc) {
      const img = new window.Image();
      img.src = imageSrc;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const rect = canvasRef.current?.getBoundingClientRect() || { width: 600, height: 400 };
        let newWidth, newHeight;

        const padding = 20;
        if ((rect.width / (rect.height - 2 * padding)) > aspectRatio) {
          newHeight = rect.height - 2 * padding;
          newWidth = newHeight * aspectRatio;
        } else {
          newWidth = rect.width;
          newHeight = newWidth / aspectRatio;
        }

        setImageDimensions({ width: newWidth, height: newHeight });
        setImageKonva(img);
      };
    }
  }, [imageSrc, modalVisible]);

  const handleDrop = (event) => {
    event.preventDefault();
    dropAreaRef.current.classList.remove('dragover');
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setInitialImage(reader.result);
        setShowImageHolder(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setInitialImage(reader.result);
        setShowImageHolder(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefresh = () => {
    fileInputRef.current.click();
  };

  const handleRemove = () => {
    setImageSrc('');
    setShowImageHolder(false);
  };

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'canvas-image.png';
    link.click();
  };

  return {
    handleDrop,
    handleFileChange,
    handleRefresh,
    handleRemove,
    handleEdit,
    handleDownload
  };
};
