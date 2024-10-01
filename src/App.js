import React, { useState, useRef } from 'react';
import './assets/styles/app.css';
import { ImageUploader } from './hooks/ImageUploader';
import ImageUploadUI from './components/ImageUploadUI';
import FormEdit from './components/form/FormEdit';


const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const [image, setImage] = useState({ src: '', width: '100%', height: '450px'});
  const [originalImage, setOriginalImage] = useState({ src: '', width: '100%', height: '450px'});

  const {
    handleDrop,
    handleFileChange,
    handleRefresh,
    handleRemove,
    handleEdit,
    handleDownload
  } = ImageUploader(
    image, fileInputRef, dropAreaRef,
    setImage, setModalVisible, setOriginalImage);

  return (
    <div className="main">
      {!modalVisible && (
        <ImageUploadUI
          dropAreaRef={dropAreaRef}
          fileInputRef={fileInputRef}
          handleDrop={handleDrop}
          handleFileChange={handleFileChange}
          handleRefresh={handleRefresh}
          handleEdit={handleEdit}
          handleRemove={handleRemove}
          image={image}
          handleDownload={handleDownload}
        />
      )}

      {modalVisible && (
        <FormEdit
          setModalVisible={setModalVisible}
          image={image}
          setImage={setImage}
          originalImage={originalImage}
          modalVisible={modalVisible} />
      )}
    </div>
  );
};

export default App;