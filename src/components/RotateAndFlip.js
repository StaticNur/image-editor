import React from 'react';

export const RotateAndFlip = ({ iconRotate, iconFlip, onRotateLeft, onRotateRight, onFlipHorizontal, onFlipVertical }) => {
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
        </div>
    );
};

export default RotateAndFlip;
