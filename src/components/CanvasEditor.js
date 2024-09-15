import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Transformer, Rect, Circle, Line, Text, Image as KonvaImage } from 'react-konva';

const CanvasEditor = ({ imageKonva, imageDimensions, shapes, setShapes,
  iconNextPrev, hideEditForm, setIsSaved, setImageSrc, textProperties, adjustments, rotation, flip, decorateProperties }) => {
  const { font, size, style, alignment, color } = textProperties;
  const { colorElements } = decorateProperties;
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState(null);

  const [history, setHistory] = useState([{ shapes: [...shapes], canvas: {} }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const transformerRef = useRef(null);
  const layerRef = useRef(null);
  const stageRef = useRef(null);
  const imageRef = useRef(null);

  const saveState = () => {
    if (!layerRef.current || !stageRef.current) return;

    const currentShapes = shapes.map(shape => {
      const node = layerRef.current.findOne(`#${shape.id}`);
      if (!node) return shape;
      switch (shape.type) {
        case 'Text':
          return {
            type: 'text',
            id: node.id(),
            text: node.text(),
            fontSize: node.fontSize(),
            fontFamily: node.fontFamily(),
            fontStyle: node.fontStyle(),
            align: node.align(),
            fill: node.fill(),
            x: node.x(),
            y: node.y(),
          };
        case 'Circle':
          return {
            type: 'circle',
            id: node.id(),
            radius: node.radius(),
            fill: node.fill(),
            stroke: node.stroke(),
            strokeWidth: node.strokeWidth(),
            x: node.x(),
            y: node.y(),
          };
        case 'Rect':
          return {
            type: 'rectangle',
            id: node.id(),
            width: node.width(),
            height: node.height(),
            fill: node.fill(),
            stroke: node.stroke(),
            strokeWidth: node.strokeWidth(),
            x: node.x(),
            y: node.y(),
            cornerRadius: node.cornerRadius(), 
          };
        case 'Line':
          return {
            type: 'line',
            id: node.id(),
            points: node.points(),
            stroke: node.stroke(),
            strokeWidth: node.strokeWidth(),
            lineCap: node.lineCap(),
            lineJoin: node.lineJoin(),
          };
        default:
          return null;
      }
    });

    const canvasState = {
      scaleX: stageRef.current.scaleX(),
      scaleY: stageRef.current.scaleY(),
      rotation: stageRef.current.rotation(),
      x: stageRef.current.x(),
      y: stageRef.current.y(),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ shapes: currentShapes, canvas: canvasState });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      console.log(historyIndex);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      console.log(historyIndex);
      setHistoryIndex(historyIndex + 1);
    }
  };

  useEffect(() => {
    if (history[historyIndex]) {
      const { shapes: newShapes, canvas: canvasState } = history[historyIndex];
      setShapes(newShapes);

      if (stageRef.current) {
        stageRef.current.scaleX(canvasState.scaleX);
        stageRef.current.scaleY(canvasState.scaleY);
        stageRef.current.rotation(canvasState.rotation);
        stageRef.current.position({ x: canvasState.x, y: canvasState.y });
        stageRef.current.batchDraw();
      }
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
    setHistory([{ shapes: [...shapes], canvas: {} }]);
    setHistoryIndex(0); 

    const canvas = stageRef.current.toCanvas();
    setImageSrc(canvas.toDataURL('image/png')); 
  };





  const handleDblClickOnText = (e) => {
    e.evt.stopPropagation();
    const textNode = e.target;
    const stage = textNode.getStage();
    const container = stage.container();
    const textarea = document.createElement('textarea');
    container.appendChild(textarea);
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = `${textNode.getClientRect().y}px`;
    textarea.style.left = `${textNode.getClientRect().x}px`;

    textarea.focus();
    textarea.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        textNode.text(textarea.value);
        container.removeChild(textarea);
        layerRef.current.draw();
        saveState();
      }
    });
  }
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
        onClick={() => setSelectedShapeId(shape.id)} 
        onDblClick={handleDblClickOnText}
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
              stroke: colorElements 
            };
          }
        }
        return shape;
      }));
    }
  }, [colorElements, selectedShapeId, setShapes]);


  useEffect(() => {
    if (imageRef.current && imageKonva) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { brightness, contrast, saturation, blur, inversion } = adjustments;

      canvas.width = imageKonva.width;
      canvas.height = imageKonva.height;

      const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) invert(${inversion}%)`;

      ctx.filter = filterString;
      ctx.drawImage(imageKonva, 0, 0);

      const filteredImage = new Image();
      filteredImage.src = canvas.toDataURL('image/png');

      filteredImage.onload = () => {
        if (imageRef.current) {
          imageRef.current.image(filteredImage);
          imageRef.current.cache();
          imageRef.current.getLayer().batchDraw();
        }
      };
    }
  }, [adjustments, imageKonva]);



  useEffect(() => {
    console.log("Rotation or Flip changed:", rotation, flip);
    if (imageRef.current) {
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [rotation, flip]);

  return (
    <div className="image-holder-form">
      <div className="image-in-form">
        <Stage
          width={imageDimensions.width}
          height={imageDimensions.height}
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
              saveState();
            }
          }}
          onMouseUp={() => {
            setIsDragging(false);
            setDragStartPos(null);
          }}
          ref={stageRef}
        >
          <Layer ref={layerRef}>
            {imageKonva && (
              <KonvaImage
                image={imageKonva}
                ref={imageRef}
                width={imageDimensions.width}
                height={imageDimensions.height}
                rotation={rotation}
                scaleX={flip.horizontal ? -1 : 1}
                scaleY={flip.vertical ? -1 : 1}
                offsetX={imageDimensions.width / 2}
                offsetY={imageDimensions.height / 2}
                x={imageDimensions.width / 2}
                y={imageDimensions.height / 2}
                name="image"
              />
            )}
            {shapes.map(shape => {
              if (shape) {
                switch (shape.type) {
                  case 'rectangle':
                    return <Rect key={shape.id} {...shape} onClick={() => setSelectedShapeId(shape.id)} />;
                  case 'circle':
                    return <Circle key={shape.id} {...shape} onClick={() => setSelectedShapeId(shape.id)} />;
                  case 'line':
                    return <Line key={shape.id} {...shape} onClick={() => setSelectedShapeId(shape.id)} />;
                  case 'text':
                    return renderText(shape);
                  default:
                    return null;
                }
              }
            })}
            <Transformer
              ref={transformerRef}
              nodes={shapes.filter(shape => shape.id === selectedShapeId).map(shape => layerRef.current.findOne(`#${shape.id}`))}
            />
          </Layer>
        </Stage>
      </div>

      <div className="footer-form">
        <h4>Revert to Original</h4>
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