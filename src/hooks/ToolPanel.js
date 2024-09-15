import React, { useState } from 'react';
import TextToolbar from '../components/TextToolbar';
import Adjust from '../components/Adjust';
import RotateAndFlip from '../components/RotateAndFlip';
import DecorateTool from '../components/DecorateTool';

export const ToolPanel = ({ activeTool, onAddShape, iconRotate, iconFlip, iconT, iconTextLeft,
    iconTextCenter, iconTextRight, iconTextAll, onTextUpdate, handleAdjustChange,
    onRotateLeft, onRotateRight, onFlipHorizontal, onFlipVertical,
     iconEllipse, iconRectangle, iconLine, onDecorateUpdate }) => {

    const resetCrop = () => {
        // Add your reset crop logic here
    };


    return (
        <div className="all-parameter">
            {/* Crop Tool */}
            {activeTool === 'crop' && (
                <div className="tool crop">
                    <label htmlFor="crop">Crop ratio</label>
                    <select id="crop" className="crop-select">
                        <option value="1:1">1:1</option>
                        <option value="4:3">4:3</option>
                        <option value="16:9">16:9</option>
                        <option value="3:2">3:2</option>
                        <option value="5:4">5:4</option>
                        <option value="21:9">21:9</option>
                        <option value="9:16">9:16</option>
                    </select>
                    <button id="reset-crop" onClick={resetCrop}>Return default</button>
                </div>
            )}

            {/* Resize Tool */}
            {activeTool === 'resize' && (
                <div className="tool resize">
                    <label htmlFor="width">Width (px)</label>
                    <input id="width" className="resize-width" defaultValue="1440" min="15" />

                    <label htmlFor="height">Height (px)</label>
                    <input id="height" className="resize-height" defaultValue="960" min="15" />

                    <div className='checkbox-constrain'>
                        <input type='checkbox' id="checkbox-size" />
                        <label htmlFor="checkbox-size">Constrain proportions</label>
                    </div>
                    <br />
                    <button id="applyCropButton">Apply Crop</button>
                    <button id="resetCropButton">Reset Crop</button>
                </div>
            )}

            {/* Rotate and Flip Tool */}
            {activeTool === 'rotate-flip' && (
                <RotateAndFlip
                    iconRotate={iconRotate}
                    iconFlip={iconFlip}
                    onRotateLeft={onRotateLeft}
                    onRotateRight={onRotateRight}
                    onFlipHorizontal={onFlipHorizontal}
                    onFlipVertical={onFlipVertical} />
            )}

            {/* Adjust Tool */}
            {activeTool === 'adjust' && (
                <Adjust onAdjustChange={handleAdjustChange} />
            )}

            {/* Filters Tool */}
            {activeTool === 'filters' && (
                <div className="tool filters">
                    {/* Add your filter options here */}
                </div>
            )}

            {/* Text Tool */}
            {activeTool === 'text' && (
                <TextToolbar
                    onAddShape={onAddShape}
                    iconT={iconT}
                    iconTextLeft={iconTextLeft}
                    iconTextCenter={iconTextCenter}
                    iconTextRight={iconTextRight}
                    iconTextAll={iconTextAll}
                    onTextUpdate={onTextUpdate}
                />
            )}

            {/* Decorate Tool */}
            {activeTool === 'decorate' && (
                <DecorateTool
                    iconEllipse={iconEllipse}
                    iconRectangle={iconRectangle}
                    iconLine={iconLine}
                    onAddShape={onAddShape} 
                    onDecorateUpdate={onDecorateUpdate}/>
            )}
        </div>
    );
};

export default ToolPanel;
