import React from 'react';
import TextToolbar from './tools/TextToolbar';
import Adjust from './tools/AdjustTool';
import RotateAndFlip from './tools/RotateAndFlipTool';
import DecorateTool from './tools/DecorateTool';
import ResizeTool from './tools/ResizeTool';
import CropperTool from './tools/CropperTool';
import FilterTool from './tools/FilterTool';



export const ToolPanel = ({ activeTool, imageDimensions, imageKonva, applyCroppedImage, 
    onProportionCropUpdate, onSizeUpdate, onRotateLeft, onRotateRight, onFlipHorizontal, 
    onFlipVertical, handleAdjustChange, handleFilterClick, onAddShape, onTextUpdate, onDecorateUpdate, handleRotateAngle}) => {

    return (
        <div className="all-parameter">
            {activeTool === 'crop' && (
                <CropperTool applyCroppedImage={applyCroppedImage} onProportionCropUpdate={onProportionCropUpdate} />
            )}

            {activeTool === 'resize' && (
                <ResizeTool onSizeUpdate={onSizeUpdate} imageDimensions={imageDimensions} />
            )}

            {activeTool === 'rotate-flip' && (
                <RotateAndFlip onRotateLeft={onRotateLeft} onRotateRight={onRotateRight}
                    onFlipHorizontal={onFlipHorizontal} onFlipVertical={onFlipVertical} handleRotateAngle={handleRotateAngle} />
            )}

            {activeTool === 'adjust' && (
                <Adjust onAdjustChange={handleAdjustChange} />
            )}

            {activeTool === 'filters' && (
                <FilterTool imageSrc={imageKonva.src} handleFilterClick={handleFilterClick} />
            )}

            {activeTool === 'text' && (
                <TextToolbar onAddShape={onAddShape} onTextUpdate={onTextUpdate} />
            )}

            {activeTool === 'pencil' && (
                <TextToolbar onAddShape={onAddShape} onTextUpdate={onTextUpdate} />
            )}

            {activeTool === 'decorate' && (
                <DecorateTool onAddShape={onAddShape} onDecorateUpdate={onDecorateUpdate} />
            )}
        </div>
    );
};

export default ToolPanel;
