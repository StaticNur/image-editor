import React, { useState, useEffect } from 'react';
import iconRotate from '../../assets/images/icon-rotate.png';
import iconFlip from '../../assets/images/icon-flip.png';

export const RotateAndFlipTool = ({ onRotateLeft, onRotateRight, onFlipHorizontal, onFlipVertical, handleRotateAngle }) => {
    const [angle, setAngle] = useState(90);

    useEffect(() => {
        handleRotateAngle(angle);
    }, [angle, handleRotateAngle]);

    const handleAngleChange = (event) => {
        setAngle(event.target.value);
    };

    return (
        <div className="tool rotate-flip">
            <label htmlFor="rotate-left">Rotate</label>
            <div className="rotate">
                <button id="rotate-left" className="rotate-left" onClick={onRotateLeft}>
                    <img src={iconRotate} alt="Rotate Left" title="Rotate Left" />
                </button>
                <button id="rotate-right" className="rotate-right" onClick={onRotateRight}>
                    <img src={iconRotate} alt="Rotate Right" title="Rotate Right" />
                </button>
            </div>

            <label htmlFor="flip-horizontal">Flip</label>
            <div className="flip">
                <button id="flip-horizontal" className="flip-horizontal" onClick={onFlipHorizontal}>
                    <img src={iconFlip} alt="Flip Horizontal" title="Flip Horizontal" />
                </button>
                <button id="flip-vertical" className="flip-vertical" onClick={onFlipVertical}>
                    <img src={iconFlip} className="flip-vertical-img" alt="Flip Vertical" title="Flip Vertical" />
                </button>
            </div>

            <div className='section-angle'>
                <div className='fixed-angle'>
                    <label htmlFor="rotate-angle">Choose angle:</label>
                    <input
                        id="angle"
                        className="angle-value"
                        readOnly
                        value={45}
                        onClick={handleAngleChange}
                    />
                    <input
                        id="angle"
                        className="angle-value"
                        readOnly
                        value={90}
                        onClick={handleAngleChange}
                    />
                </div>
                <label htmlFor="angle-custom">Current angle: </label>
                <input
                    id="angle-custom"
                    className="angle-value"
                    type="number"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={handleAngleChange}
                />
            </div>

        </div>
    );
};

export default RotateAndFlipTool;
