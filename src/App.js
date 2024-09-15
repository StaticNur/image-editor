import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Rect, Circle, Line } from 'react-konva';
import iconPlus from './assets/images/icon+.png';
import iconReload from './assets/images/icon-reload.png';
import iconEdit from './assets/images/icon-edit.png';
import iconDelete from './assets/images/icon-delete.png';
import closeButton from './assets/images/closeButton.png';
import iconCrop from './assets/images/icon-crop.png';
import iconResize from './assets/images/icon-resize.png';
import iconRepeat from './assets/images/icon-repeat.png';
import iconSliders from './assets/images/icon-sliders.png';
import iconFilters from './assets/images/icon-filters.png';
import iconT from './assets/images/icon-t.png';
import iconStar from './assets/images/icon-star.png';
import iconNextPrev from './assets/images/icon-next-prev.png';

import iconRotate from './assets/images/icon-rotate.png';
import iconFlip from './assets/images/icon-flip.png';
import iconTextLeft from './assets/images/icon-text-left.png';
import iconTextCenter from './assets/images/icon-text-center.png';
import iconTextRight from './assets/images/icon-text-right.png';
import iconTextAll from './assets/images/icon-text-all.png';
import iconDownload from './assets/images/icon-download.png';
import iconEllipse from './assets/images/icon-ellipse.png';
import iconRectangle from './assets/images/icon-rectangle.png';
import iconLine from './assets/images/icon-line.png';

import './app.css'; 
import { useImageUploader } from './hooks/useImageUploader';
import ToolPanel from './hooks/ToolPanel';
import ImageUpload from './hooks/ImageUpload';
import CanvasEditor from './components/CanvasEditor';

const App = () => {
  const [imageSrc, setImageSrc] = useState(''); 
  const [showImageHolder, setShowImageHolder] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageKonva, setImageKonva] = useState(null); 
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const canvasRef = useRef(null);
  let [isSaved, setIsSaved] = useState(false);


  const [activeTool, setActiveTool] = useState('');
  const [shapes, setShapes] = useState([]);
  const [initialImage, setInitialImage] = useState('');

  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const handleRotateLeft = () => {
    setRotation(prevRotation => prevRotation - 90);
  };

  const handleRotateRight = () => {
    setRotation(prevRotation => prevRotation + 90);
  };

  const handleFlipHorizontal = () => {
    setFlip(prevFlip => ({ ...prevFlip, horizontal: !prevFlip.horizontal }));
  };

  const handleFlipVertical = () => {
    setFlip(prevFlip => ({ ...prevFlip, vertical: !prevFlip.vertical }));
  };


  const [decorateProperties, setDecorateProperties] = useState({decorateProperties: '#000000'});

  const [textProperties, setTextProperties] = useState({});
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    inversion: 0
  });
  const handleAdjustChange = (newAdjustments) => {
    setAdjustments(newAdjustments);
  };

  const hideEditForm = () => {
    console.log('isSaved:', isSaved); // Для отладки
    if (isSaved) {
      setShapes([]);
      setModalVisible(false);
      setIsSaved(false); // Устанавливаем состояние как несохраненное
    } else {
      if (window.confirm("Save all changes and exit")) {
        setImageSrc(initialImage);
        setModalVisible(false);
        setShapes([]);
        setIsSaved(false); // Сбрасываем состояние сохранения
      }
    }
  };

  const {
    handleDrop,
    handleFileChange,
    handleRefresh,
    handleRemove,
    handleEdit,
    handleDownload
  } = useImageUploader(
    imageSrc, setInitialImage, modalVisible, fileInputRef, dropAreaRef, canvasRef,
    setImageDimensions, setImageKonva, setImageSrc, setShowImageHolder, setModalVisible);

  const handleToolClick = (tool) => {
    setActiveTool(tool);
  };

  const addShape = (type) => {
    const newShape = {
      id: `shape${shapes.length + 1}`,
      type,
      x: 100,
      y: 100,
      width: type === 'line' ? 150 : 100,
      height: type === 'line' ? 5 : 100,
      points: type === 'line' ? [0, 0, 150, 150] : undefined,
      radius: type === 'circle' ? 50 : undefined,
      fill: type === 'line' ? undefined : 'red',
      stroke: type === 'line' ? 'green' : undefined,
      strokeWidth: type === 'line' ? 5 : undefined,
      text: type === 'text' ? 'Your Text Here' : undefined,
      fontSize: type === 'text' ? 24 : undefined,
      draggable: true,
    };
    setShapes([...shapes, newShape]);
  };

  return (
    <div className="main">
      <ImageUpload
        showImageHolder={showImageHolder}
        dropAreaRef={dropAreaRef}
        fileInputRef={fileInputRef}
        handleDrop={handleDrop}
        iconPlus={iconPlus}
        handleFileChange={handleFileChange}
        handleRefresh={handleRefresh}
        iconReload={iconReload}
        handleEdit={handleEdit}
        iconEdit={iconEdit}
        handleRemove={handleRemove}
        iconDelete={iconDelete}
        imageSrc={imageSrc}
        iconDownload={iconDownload}
        handleDownload={handleDownload}
      />


      {modalVisible && (
        <div id="editOverlay" className="overlay" style={{ display: modalVisible ? 'block' : 'none' }}>
          <div className="form edit-form">
            <div className="form-header">
              <h3>Image Editor</h3>
              <img src={closeButton} alt="close button" title="close edit-form" onClick={hideEditForm} />
            </div>
            <div className="form-content">
              <div className="options">
                <div className="option" id="cropOption" onClick={() => handleToolClick('crop')}>
                  <img src={iconCrop} /> Crop</div>
                <div className="option" id="resizeOption" onClick={() => handleToolClick('resize')}>
                  <img src={iconResize} /> Resize</div>
                <div className="option" id="rotateOption" onClick={() => handleToolClick('rotate-flip')}>
                  <img src={iconRepeat} /> Rotate and Flip</div>
                <div className="option" id="adjustOption" onClick={() => handleToolClick('adjust')}>
                  <img src={iconSliders} /> Adjust</div>
                <div className="option" id="filtersOption" onClick={() => handleToolClick('filters')}>
                  <img src={iconFilters} /> Filters</div>
                <div className="option" id="textOption" onClick={() => handleToolClick('text')}>
                  <img src={iconT} /> Text</div>
                <div className="option" id="elementsOption" onClick={() => handleToolClick('decorate')}>
                  <img src={iconStar} /> Elements</div>
              </div>

              <CanvasEditor imageKonva={imageKonva} imageDimensions={imageDimensions}
                shapes={shapes} setShapes={setShapes} iconNextPrev={iconNextPrev}
                hideEditForm={hideEditForm} setIsSaved={setIsSaved} setImageSrc={setImageSrc}
                textProperties={textProperties} adjustments={adjustments} rotation={rotation} flip={flip} decorateProperties={decorateProperties} />

              <ToolPanel
                activeTool={activeTool}
                onAddShape={addShape}
                iconRotate={iconRotate}
                iconFlip={iconFlip}
                iconT={iconT}
                iconTextLeft={iconTextLeft}
                iconTextCenter={iconTextCenter}
                iconTextRight={iconTextRight}
                iconTextAll={iconTextAll}
                onTextUpdate={setTextProperties}
                handleAdjustChange={handleAdjustChange}
                onRotateLeft={handleRotateLeft}
                onRotateRight={handleRotateRight}
                onFlipHorizontal={handleFlipHorizontal}
                onFlipVertical={handleFlipVertical}
                iconEllipse={iconEllipse}
                iconRectangle={iconRectangle}
                iconLine={iconLine}
                onDecorateUpdate={setDecorateProperties} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;