
export const ImageUploader = (image, fileInputRef, dropAreaRef, setImage,
   setModalVisible, setOriginalImage) => {

  const handleDrop = (event) => {
    event.preventDefault();
    dropAreaRef.current.classList.remove('dragover');
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage({ src: reader.result, width: '100%', height: '450px'});
        setOriginalImage({ src: reader.result, width: '100%', height: '450px'});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage({ src: reader.result, width: '100%', height: '450px'});
        setOriginalImage({ src: reader.result, width: '100%', height: '450px'});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefresh = () => {
    fileInputRef.current.click();
  };

  const handleRemove = () => {
    setImage({ src: '', width: '100%', height: '450px'});
  };

  const handleEdit = () => {
    setModalVisible(true);
  };

  // const handleDownload = () => {
  //   const link = document.createElement('a');
  //   link.href = image.src;
  //   link.download = 'canvas-image.png';
  //   link.click();
  // };
  const handleDownload = () => {
    // Создаем временный canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Настройка размеров canvas
    canvas.width = image.width;
    canvas.height = image.height;

    // Создаем объект Image для загрузки изображения
    const image2 = new Image();
    image2.src = image.src;

    image2.onload = () => {
      // Отрисовываем изображение на canvas
      context.drawImage(image2, 0, 0, image.width, image.height);

      // Создаем ссылку для скачивания изображения
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png'); // Преобразуем canvas в URL изображения
      link.download = 'downloaded-image.png'; // Имя скачиваемого файла
      link.click();

      // Удаляем временный canvas
      canvas.remove();
    };
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
