import React, { useEffect, useState } from 'react';

export const ResizeTool = ({ onSizeUpdate, imageDimensions }) => {
    const [width, setWidth] = useState(imageDimensions ? imageDimensions.width : 1440);
    const [height, setHeight] = useState(imageDimensions ? imageDimensions.height : 960);
    const [constrain, setConstrain] = useState(false);

    useEffect(() => {
        onSizeUpdate({ width, height, constrain });
    }, [width, height, constrain]);

    useEffect(() => {
        setWidth(imageDimensions.width);
        setHeight(imageDimensions.height);
    }, [imageDimensions]);

    const handleWidthChange = (event) => {
        const newWidth = parseInt(event.target.value, 10);
        if (newWidth > 10) {
            setWidth(newWidth);
            if (constrain) {
                setHeight(Math.round(newWidth * (height / width)));
            }
        }
    };

    const handleHeightChange = (event) => {
        const newHeight = parseInt(event.target.value, 10);
        if (newHeight > 10) {
            setHeight(newHeight);
            if (constrain) {
                setWidth(Math.round(newHeight * (width / height)));
            }
        }
    };

    const handleConstrainChange = (event) => {
        setConstrain(event.target.checked);
    };

    return (
        <div className="tool resize">
            <label htmlFor="width">Width (px)</label>
            <input
                id="width"
                className="resize-width"
                type="number"
                min="15"
                value={width}
                onChange={handleWidthChange}
            />

            <label htmlFor="height">Height (px)</label>
            <input
                id="height"
                className="resize-height"
                type="number"
                min="15"
                value={height}
                onChange={handleHeightChange}
            />

            <div className='checkbox-constrain'>
                <input
                    type='checkbox'
                    id="checkbox-size"
                    checked={constrain}
                    onChange={handleConstrainChange}
                />
                <label htmlFor="checkbox-size">Constrain proportions</label>
            </div>
        </div>
    );
};

export default ResizeTool;
