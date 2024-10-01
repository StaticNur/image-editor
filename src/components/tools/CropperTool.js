import React, { useEffect, useState } from 'react';


export const CropperTool = ({ applyCroppedImage, onProportionCropUpdate }) => {

    const [proportion, setProportion] = useState('1');

    useEffect(() => {
        onProportionCropUpdate(proportion);
    }, [proportion]);

    return (
        <div className="tool crop">
            <label htmlFor="crop">Crop ratio</label>
            <select id="crop" className="crop-select" value={proportion} onChange={e => setProportion(e.target.value)}>
                <option value="1">1:1</option>
                <option value="1.778">16:9</option>
                <option value="1.333">4:3</option>
            </select>
            <button id="applyCropButton" onClick={applyCroppedImage}>Apply Crop</button>
        </div>
    );
};
export default CropperTool;