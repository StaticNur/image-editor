import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Transformer, Rect, Circle, Line, Text, Image as KonvaImage, Group } from 'react-konva';
import ImageCropper from './ImageCropper';
import ImageFilter from './ImageFilter';
import RenderTextEditArea from './RenderTextEditArea';
import iconNextPrev from '../assets/images/icon-next-prev.png';

const CanvasEditor = ({ mainImage, imageKonva, setImageKonva, croppedImage,
  setCroppedImage, activeTool, imageDimensions, setImageDimensions, constrain, shapes, setShapes,
  hideEditForm, setIsSaved, setImage, textProperties,
  adjustments, rotation, flip, decorateProperties, handleImageCropped, proportionCrop, filter, originalImage, canvasRef }) => {
  const { font, size, style, alignment, color } = textProperties;
  const { colorElements, widthLine } = decorateProperties;
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState(null);
  const [showResizeHandles, setShowResizeHandles] = useState(true); // состояние для управления видимостью

  const [imageWidth, setImageWidth] = useState(imageDimensions.width);
  const [imageHeight, setImageHeight] = useState(imageDimensions.height);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);


  const transformerRef = useRef(null);
  const layerRef = useRef(null);
  const stageRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    console.log("trying to save cropped image");
    if (history.length === 0) {
      const img = new window.Image();
      img.src = originalImage.src;
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
        setHistory([{
          image: img,
          shapes: [],
          canvas: {
            image: img,
            scaleX: 0,
            scaleY: 0,
            rotation: 0,
            x: newWidth / 2,
            y: newHeight / 2,
            width: newWidth,
            height: newHeight,
          },
        }]);
      };

    }
    if (croppedImage) {
      // Получаем размеры канваса
      const canvasWidth = imageWidth; // ширина канваса
      const canvasHeight = imageHeight; // высота канваса

      // Рассчитываем центрированное положение изображения
      const centerX = (canvasWidth - imageWidth) / 2;
      const centerY = (canvasHeight - imageHeight) / 2;

      // Добавляем "скриншот" в историю
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({
        image: croppedImage,
        shapes: [...shapes],
        canvas: {
          image: croppedImage,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          x: centerX, // Центрируем изображение по X
          y: centerY, // Центрируем изображение по Y
          width: imageWidth,
          height: imageHeight
        },
      });

      // Обновляем историю и индекс истории
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCroppedImage(null);
      console.log("Image saved in history");
      console.log(JSON.stringify(history));
    }
  }, [imageKonva]);


  const saveState = () => {
    if (!layerRef.current || !stageRef.current) return;
    setShowResizeHandles(false);

    const currentShapes = shapes.map(shape => {
      const node = layerRef.current.findOne(`#${shape.id}`);
      if (!node) {
        console.warn(`Node with id ${shape.id} not found`);
        return shape;
      }
      switch (shape.type) {
        case 'text':
          return {
            ...shape,
            x: node.x(),
            y: node.y(),
            fontSize: node.fontSize(),
            fontFamily: node.fontFamily(),
            fill: node.fill(),
          };
        case 'circle':
          return {
            ...shape,
            x: node.x(),
            y: node.y(),
            radius: node.radius(),
            fill: node.fill(),
          };
        case 'rectangle':
          return {
            ...shape,
            x: node.x(),
            y: node.y(),
            width: node.width(),
            height: node.height(),
            fill: node.fill(),
          };
        case 'line':
          return {
            ...shape,
            x: node.x(),
            y: node.y(),
            points: node.points(),
            stroke: node.stroke(),
          };
        default:
          return shape;
      }
    });
    const canvasState = {
      image: imageKonva,
      scaleX: stageRef.current.scaleX(),
      scaleY: stageRef.current.scaleY(),
      rotation: stageRef.current.rotation(),
      x: stageRef.current.x(),
      y: stageRef.current.y(),
      width: imageWidth,
      height: imageHeight,
    };

    const newHistory = [...history.slice(0, historyIndex + 1), { image: canvasState.image, shapes: currentShapes, canvas: canvasState }];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setShowResizeHandles(true);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  };

  // Apply the history changes
  useEffect(() => {
    if (history[historyIndex]) {
      console.log(historyIndex);
      console.log(history);
      const { image: newImageCurrent, shapes: newShapes, canvas: canvasState } = history[historyIndex];
      setShapes(newShapes);

      // Update shapes on canvas
      newShapes.forEach(shape => {
        const node = layerRef.current.findOne(`#${shape.id}`);
        if (node) {
          node.position({ x: shape.x, y: shape.y });
          if (shape.type === 'text') {
            node.fontSize(shape.fontSize);
            node.fontFamily(shape.fontFamily);
            node.fill(shape.fill);
          }
          node.draw();
        }
      });
      // Update canvas state
      if (stageRef.current) {
        stageRef.current.scaleX(canvasState.scaleX);
        stageRef.current.scaleY(canvasState.scaleY);
        stageRef.current.rotation(canvasState.rotation);
        stageRef.current.position({ x: canvasState.x, y: canvasState.y });
        stageRef.current.batchDraw();
      }

      //if (croppedImage) {
      setImageKonva(newImageCurrent);
      //}
      // Update image width/height
      setImageWidth(canvasState.width);
      setImageHeight(canvasState.height);
    }
  }, [historyIndex, history, setShapes]);


  const closeCancel = () => {
    console.log(closeCancel);
    setIsSaved(false);
    hideEditForm();
  };

  const closeSave = () => {
    console.log("closeSave");
    setIsSaved(true);
    hideEditForm();

    saveState();
    //screenShot();
    if (history.length > 1) {
      const { image: newImageCurrent, shapes: newShapes, canvas: canvasState } = history[history.length - 1];
      console.log("newImageCurrent", newImageCurrent);
      //setImage({ src: newImageCurrent.src, width: imageWidth, height: imageHeight });
      saveCanvasAsImage();
      setHistory(history[historyIndex]);
      setHistoryIndex(0);
    } else {
      console.log("imageKonva", imageKonva);
      // setImage(prevState => ({ ...prevState, src: imageKonva.src }));
      saveCanvasAsImage();
      //setImage({ src: imageKonva.src, width: imageWidth, height: imageHeight });
    }
  };
  // Function to save the canvas as a base64 image and store it in setImage
  const saveCanvasAsImage = () => {
    if (!stageRef.current) return;

    // Convert the canvas to a data URL (base64 image)
    const dataURL = stageRef.current.toDataURL();

    // Update the image state with the base64 data URL
    setImage({ src: dataURL, width: imageWidth, height: imageHeight });
    const img = new window.Image();
    img.src = dataURL;
    img.onload = () => {
      setImageKonva(img);
    };
  };
  
  const handleRevert = () => {
    setImage(originalImage);
  }


  const [editingText, setEditingText] = useState(null);
  useEffect(() => {
    if (editingText) {
      RenderTextEditArea(editingText, stageRef, setEditingText, transformerRef);
    }
  }, [editingText]);
  const handleSelectElement = (shape) => {
    const selectedNode = stageRef.current.findOne(`#${shape.id}`);
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.update();
    } else {
      console.error('Selected node not found:', shape.id);
    }
  };

  const handleDragEnd = () => {
    saveState();
  };

  const renderText = (shape) => {
    const isSelected = shape.id === selectedShapeId;
    return (
      <Text
        key={shape.id}
        id={shape.id}
        text={shape.text}
        fontSize={isSelected ? size : shape.fontSize}
        fontFamily={isSelected ? font : shape.fontFamily}
        fill={isSelected ? color : shape.fill}
        align={isSelected ? alignment : shape.align}
        fontStyle={isSelected ? `${style.bold ? 'bold ' : ''}${style.italic ? 'italic' : ''}` : shape.fontStyle}
        decoration={isSelected ? `${style.underline ? 'underline ' : ''}${style.strikethrough ? 'line-through' : ''}` : shape.decoration}
        draggable
        onClick={() => {
          handleSelectElement(shape)
        }}
        onDragEnd={handleDragEnd}
        onDblClick={() => setEditingText(shape)}
        onDblTap={() => setEditingText(shape)}
      />
    );
  };
  const renderLine = (shape) => {
    const isSelected = shape.id === selectedShapeId;
  
    return (
      <Line
        key={shape.id}
        id={shape.id}
        points={shape.points}
        stroke={isSelected ? colorElements : shape.stroke}
        strokeWidth={isSelected ? (widthLine > 0 ? widthLine : shape.strokeWidth) : shape.strokeWidth} 
        lineCap="round"
        lineJoin="round"
        draggable
        onClick={() => setSelectedShapeId(shape.id)}
      />
    );
  };
  

  useEffect(() => {
    if (selectedShapeId) {
      setShapes(prevShapes => prevShapes.map(shape => {
        if (shape.id === selectedShapeId && shape.type === 'text') {
          return {
            ...shape,
            fontFamily: font,
            fontSize: size,
            fill: color,
            align: alignment,
            fontStyle: `${style.bold ? 'bold ' : ''}${style.italic ? 'italic' : ''}`,
            decoration: `${style.underline ? 'underline ' : ''}${style.strikethrough ? 'line-through' : ''}`
          };
        }
        return shape;
      }));
    }
  }, [font, size, style, alignment, color, selectedShapeId, setShapes]);

  useEffect(() => {
    if (selectedShapeId) {
      console.log(colorElements)
      setShapes(prevShapes => prevShapes.map(shape => {
        if (shape.id === selectedShapeId) {
          if (shape.type === 'rectangle' || shape.type === 'circle') {
            return {
              ...shape,
              fill: colorElements
            };
          }
          if (shape.type === 'line') {
            return {
              ...shape,
              stroke: colorElements,
              strokeWidth: widthLine
            };
          }
        }
        return shape;
      }));
    }
  }, [colorElements, widthLine, selectedShapeId, setShapes]);


  useEffect(() => {
    if (imageRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { brightness, contrast, saturation, exposition, temperature, blur, inversion } = adjustments;
  
      canvas.width = imageKonva.width;
      canvas.height = imageKonva.height;
  
      // Экспозиция как отдельный множитель
      const adjustedBrightness = brightness;
      const adjustedExposition = exposition / 100 + 1;
  
      // Применение фильтров с учетом как яркости, так и экспозиции
      const filterString = `brightness(${adjustedBrightness * adjustedExposition}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) invert(${inversion}%)`;
      
      // Применение фильтров на изображении
      ctx.filter = filterString;
      ctx.drawImage(imageKonva, 0, 0);
  
      // Получаем данные изображения
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
  
      // Рассчитываем температурный коэффициент (5000K как нейтральное значение)
      const tempFactor = (temperature - 5000) / 5000;
  
      // Применение эффекта температуры к каждому пикселю
      for (let i = 0; i < data.length; i += 4) {
        // Красный канал
        data[i] = Math.min(255, data[i] + tempFactor * 50);
        // Синий канал
        data[i + 2] = Math.max(0, data[i + 2] - tempFactor * 50);
      }
  
      // Возвращаем измененные данные изображения на холст
      ctx.putImageData(imageData, 0, 0);
  
      // Создаем новое изображение с примененными фильтрами
      const filteredImage = new Image();
      filteredImage.src = canvas.toDataURL('image/png');
  
      filteredImage.onload = () => {
        if (imageRef.current) {
          imageRef.current.image(filteredImage);
          imageRef.current.getLayer().batchDraw();
        }
      };
    }
  }, [adjustments]);
  



  useEffect(() => {
    console.log("Rotation or Flip changed:", rotation, flip);
    if (imageRef.current) {
      saveState();
      imageRef.current.getLayer().batchDraw();
    }
  }, [rotation, flip]);


  useEffect(() => {
    setImageWidth(imageDimensions.width);
    setImageHeight(imageDimensions.height);
  }, [imageDimensions]);

  const calculateNewDimensions = (newWidth, newHeight) => {
    if (constrain) {
      const aspectRatio = imageWidth / imageHeight;
      if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }
    }
    newWidth = parseFloat(newWidth.toFixed(1));
    newHeight = parseFloat(newHeight.toFixed(1));
    return { newWidth, newHeight };
  };

  const handleResize = (newWidth, newHeight) => {
    const { newWidth: constrainedWidth, newHeight: constrainedHeight } = calculateNewDimensions(newWidth, newHeight);
    setImageDimensions({ width: constrainedWidth, height: constrainedHeight });
    if (imageRef.current) {
      imageRef.current.width(constrainedWidth);
      imageRef.current.height(constrainedHeight);
      imageRef.current.getLayer().batchDraw();
    }
  };

  const handleResizeDrag = (side, e) => {
    const { x, y } = e.target.position();
    switch (side) {
      case 'top-left':
        handleResize(imageWidth - x, imageHeight - y);
        break;
      case 'top-right':
        handleResize(x, imageHeight - y);
        break;
      case 'bottom-left':
        handleResize(imageWidth - x, y);
        break;
      case 'bottom-right':
        handleResize(x, y);
        break;
      default:
        break;
    }
  };

  return (
    <div className="image-holder-form">
      <div className="image-in-form" id='image-canvas'>
        {imageKonva && activeTool === 'crop' && (
          <ImageCropper
            imageToCrop={imageKonva.src}
            width={imageWidth}
            height={imageHeight}
            cropScale={proportionCrop}
            onImageCropped={handleImageCropped}
          />
        )}
        {imageKonva && activeTool !== 'crop' && (
          <Stage
            width={imageWidth}
            height={imageHeight}
            onClick={e => setSelectedShapeId(e.target === e.target.getStage() ? null : e.target.id())}

            onMouseMove={e => {
              if (isDragging && dragStartPos) {
                const stage = stageRef.current;
                if (!stage) return;
                const mousePos = { x: e.evt.clientX, y: e.evt.clientY };
                const dx = mousePos.x - dragStartPos.x;
                const dy = mousePos.y - dragStartPos.y;
                stage.position({
                  x: stage.x() + dx,
                  y: stage.y() + dy
                });
                setDragStartPos(mousePos);
                stage.batchDraw();
              }
            }}
            onMouseUp={() => {
              setIsDragging(false);
              setDragStartPos(null);
            }}
            ref={stageRef}
          >
            <Layer ref={layerRef}>
              <Group>
                {activeTool === 'filters' && (
                  <>
                    <ImageFilter
                      imageRef={imageRef}
                      imageSrc={imageKonva}
                      selectedFilter={filter}
                    />
                  </>
                )}
                <KonvaImage
                  image={imageKonva}
                  ref={imageRef}
                  width={imageWidth}
                  height={imageHeight}
                  rotation={rotation}
                  scaleX={flip.horizontal ? -1 : 1}
                  scaleY={flip.vertical ? -1 : 1}
                  offsetX={imageWidth / 2}
                  offsetY={imageHeight / 2}
                  x={imageWidth / 2}
                  y={imageHeight / 2}
                  name="image"
                />
                {activeTool === 'resize' && showResizeHandles && (
                  <>
                    <Rect
                      x={0}
                      y={0}
                      width={10}
                      height={10}
                      fill="red"
                      draggable
                      onDragMove={e => handleResizeDrag('top-left', e)}
                      onDragEnd={saveState}
                    />
                    <Rect
                      x={imageWidth - 10}
                      y={0}
                      width={10}
                      height={10}
                      fill="red"
                      draggable
                      onDragMove={e => handleResizeDrag('top-right', e)}
                      onDragEnd={saveState}
                    />
                    <Rect
                      x={0}
                      y={imageHeight - 10}
                      width={10}
                      height={10}
                      fill="red"
                      draggable
                      onDragMove={e => handleResizeDrag('bottom-left', e)}
                      onDragEnd={saveState}
                    />
                    <Rect
                      x={imageWidth - 10}
                      y={imageHeight - 10}
                      width={10}
                      height={10}
                      fill="red"
                      draggable
                      onDragMove={e => handleResizeDrag('bottom-right', e)}
                      onDragEnd={saveState}
                    />
                  </>
                )}
              </Group>
              {shapes.map(shape => {
                if (shape) {
                  switch (shape.type) {
                    case 'rectangle':
                      return <Rect key={shape.id} {...shape} onClick={() => setSelectedShapeId(shape.id)} />;
                    case 'circle':
                      return <Circle key={shape.id} {...shape} onClick={() => setSelectedShapeId(shape.id)} />;
                    case 'line':
                      return renderLine(shape);
                    case 'text':
                      return renderText(shape);
                    default:
                      return null;
                  }
                }
              })}
              <Transformer
                ref={transformerRef}
                nodes={(() => {
                  const selectedNode = shapes
                    .filter(shape => shape.id === selectedShapeId)
                    .map(shape => layerRef.current?.findOne(`#${shape.id}`)) // Use optional chaining to avoid accessing undefined nodes
                    .filter(node => node !== null); // Ensure valid nodes are passed

                  return selectedNode.length > 0 ? selectedNode : [];
                })()}
              />


            </Layer>
          </Stage>
        )}
      </div>

      <div className="footer-form">
        <button id="revert" onClick={handleRevert}>Revert to Original</button>
        <div className="history">
          <button id="prev" onClick={handleUndo}><img src={iconNextPrev} alt="Undo" /></button>
          <button id="next" onClick={handleRedo}><img src={iconNextPrev} alt="Redo" /></button>
        </div>
        <div className="buttons-result">
          <button id="cancel" onClick={closeCancel}>Cancel</button>
          <button id="save" onClick={closeSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;



















// onWheel={e => {
//   e.evt.preventDefault();
//   const stage = stageRef.current;
//   if (!stage) return;
//   const oldScale = stage.scaleX();
//   const pointer = stage.getPointerPosition();
//   const direction = e.evt.deltaY < 0 ? 1 : -1;
//   const scaleBy = 1.1;
//   const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
//   stage.scale({ x: newScale, y: newScale });
//   const mousePointTo = {
//     x: (pointer.x - stage.x()) / oldScale,
//     y: (pointer.y - stage.y()) / oldScale,
//   };
//   const newPos = {
//     x: pointer.x - mousePointTo.x * newScale,
//     y: pointer.y - mousePointTo.y * newScale,
//   };
//   stage.position(newPos);
//   stage.batchDraw();
//   saveState(); // Save state after scaling
// }}
// onMouseDown={e => {
//   if (e.target === e.target.getStage()) {
//     setIsDragging(true);
//     setDragStartPos({ x: e.evt.clientX, y: e.evt.clientY });
//   }
// }}