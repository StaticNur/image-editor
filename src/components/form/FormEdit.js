import React, { useState, useEffect, useRef } from 'react';
import CanvasEditor from '../../hooks/CanvasEditor';
import ToolPanel from '../ToolPanel';
import SidebarMenu from '../SidebarMenu';
import HeaderForm from './HeaderForm';

const FormEdit = ({ setModalVisible, image, setImage, originalImage, modalVisible }) => {
    const canvasRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [imageKonva, setImageKonva] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [activeTool, setActiveTool] = useState('crop');
    const [croppedImage, setCroppedImage] = useState(null);
    const [proportionCrop, setproportionCrop] = useState('1');
    const [constrain, setConstrain] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [flip, setFlip] = useState({ horizontal: false, vertical: false });
    const [filter, setFilter] = useState('none');
    const [angle, setAngle] = useState(0);
    const [decorateProperties, setDecorateProperties] = useState({ decorateProperties: '#000000', widthLine: 5 });
    const [textProperties, setTextProperties] = useState({});
    const [shapes, setShapes] = useState([]);
    const [adjustments, setAdjustments] = useState({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        exposition: 1,
        temperature: 5000,
        blur: 0,
        inversion: 0
    });

    useEffect(() => {
        if (image.src) {
            const img = new window.Image();
            img.src = image.src;
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
                console.log('newWidth: '+newWidth+' newHeight: '+newHeight);
                setImageDimensions({ width: newWidth, height: newHeight });
                setImageKonva(img);
            };
        }
    }, [image.src, modalVisible]);

    const handleFilterClick = (filter) => {
        setFilter(filter);
    };

    const handleRotateLeft = () => {
        console.log("handleRotateLeft: "+angle);
        setRotation(prevRotation => prevRotation - angle);
    };

    const handleRotateRight = () => {
        console.log("handleRotateRight: "+angle);
        setRotation(prevRotation => Number(prevRotation) + Number(angle));
    };

    const handleFlipHorizontal = () => {
        setFlip(prevFlip => ({ ...prevFlip, horizontal: !prevFlip.horizontal }));
    };

    const handleFlipVertical = () => {
        setFlip(prevFlip => ({ ...prevFlip, vertical: !prevFlip.vertical }));
    };

    const handleSizeUpdate = ({ width, height, constrain }) => {
        setImageDimensions({ width, height });
        setConstrain(constrain);
    };

    const handleAdjustChange = (newAdjustments) => {
        setAdjustments(newAdjustments);
    };

    const handleImageCropped = (croppedImage) => {
        setCroppedImage(croppedImage);
    };

    const applyCroppedImage = () => {
        if (croppedImage) {
            console.log('croppedImage', croppedImage.src);
            const img = new window.Image();
            img.src = croppedImage.src; // Используем src для отображения обрезанного изображения
            img.onload = () => {
                setImageKonva(img); // Устанавливаем новое изображение на канвасе
            };
        }
    };

    const hideEditForm = () => {
        console.log('isSaved:', isSaved); // Для отладки
        if (isSaved) {
            setShapes([]);
            setModalVisible(false);
            setIsSaved(false); // Устанавливаем состояние как несохраненное
        } else {
            if (window.confirm("Save all changes and exit")) {
                setImage(originalImage);
                setModalVisible(false);
                setShapes([]);
                setIsSaved(false); // Сбрасываем состояние сохранения
            }
        }
    };

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
        <div id="editOverlay" className="overlay" style={{ display: modalVisible ? 'block' : 'none' }}>
            <div className="form edit-form">
                <HeaderForm hideEditForm={hideEditForm} />
                <div className="form-content">
                    <SidebarMenu handleToolClick={handleToolClick} />

                    <CanvasEditor mainImage={image} imageKonva={imageKonva} setImageKonva={setImageKonva} 
                    croppedImage={croppedImage} setCroppedImage={setCroppedImage}
                        activeTool={activeTool}
                        imageDimensions={imageDimensions}
                        setImageDimensions={setImageDimensions} constrain={constrain}
                        shapes={shapes} setShapes={setShapes}
                        hideEditForm={hideEditForm} setIsSaved={setIsSaved} setImage={setImage}
                        textProperties={textProperties} adjustments={adjustments} rotation={rotation}
                        flip={flip} decorateProperties={decorateProperties} handleImageCropped={handleImageCropped}
                        proportionCrop={proportionCrop} filter={filter} originalImage={originalImage} canvasRef={canvasRef}/>

                    <ToolPanel activeTool={activeTool}
                        imageDimensions={imageDimensions}
                        imageKonva={imageKonva}
                        applyCroppedImage={applyCroppedImage}
                        onProportionCropUpdate={setproportionCrop}
                        onSizeUpdate={handleSizeUpdate}
                        onRotateLeft={handleRotateLeft}
                        onRotateRight={handleRotateRight}
                        onFlipHorizontal={handleFlipHorizontal}
                        onFlipVertical={handleFlipVertical}
                        handleAdjustChange={handleAdjustChange}
                        handleFilterClick={handleFilterClick}
                        onAddShape={addShape}
                        onTextUpdate={setTextProperties}
                        onDecorateUpdate={setDecorateProperties}
                        handleRotateAngle={setAngle} />
                </div>
            </div>
        </div>
    );
};
export default FormEdit;