import React, { useState } from 'react';


export const AdjustTool = ({ onAdjustChange }) => {
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [exposition, setExposition] = useState(1);
    const [temperature, setTemperature] = useState(5000);

    const [blur, setBlur] = useState(0);
    const [inversion, setInversion] = useState(0);

    const handleChange = (type, value) => {
        const numericValue = Number(value);
        switch (type) {
            case 'brightness':
                setBrightness(numericValue);
                break;
            case 'contrast':
                setContrast(numericValue);
                break;
            case 'saturation':
                setSaturation(numericValue);
                break;
            case 'exposition':
                setExposition(numericValue);
                break;
            case 'temperature':
                setTemperature(numericValue);
                break;
            case 'blur':
                setBlur(numericValue);
                break;
            case 'inversion':
                setInversion(numericValue);
                break;
            default:
                break;
        }
        onAdjustChange({ brightness, contrast, saturation, exposition, temperature, blur, inversion });
    };


    const resetAdjust = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setExposition(1);
        setTemperature(5000);
        setBlur(0);
        setInversion(0);
        onAdjustChange({ brightness: 100, contrast: 100,
             saturation: 100, exposition: 1, temperature: 5000, blur: 0, inversion: 0 });
    };

    return (
        <div className="tool adjust">
            <div className="slider-container">
                <label className="slider-label" htmlFor="brightness">Brightness</label>
                <input
                    className="slider"
                    type="range"
                    id="brightness"
                    min="0"
                    max="300"
                    value={brightness}
                    onChange={(e) => handleChange('brightness', e.target.value)}
                />
                <input
                    className="slider-value"
                    type="number"
                    value={brightness}
                    onChange={(e) => handleChange('brightness', e.target.value)}
                />
            </div>

            <div className="slider-container">
                <label className="slider-label" htmlFor="contrast">Contrast</label>
                <input
                    className="slider"
                    type="range"
                    id="contrast"
                    min="0"
                    max="300"
                    value={contrast}
                    onChange={(e) => handleChange('contrast', e.target.value)}
                />
                <input
                    className="slider-value"
                    type="number"
                    value={contrast}
                    onChange={(e) => handleChange('contrast', e.target.value)}
                />
            </div>

            <div className="slider-container">
                <label className="slider-label" htmlFor="saturation">Saturation</label>
                <input
                    className="slider"
                    type="range"
                    id="saturation"
                    min="0"
                    max="100"
                    value={saturation}
                    onChange={(e) => handleChange('saturation', e.target.value)}
                />
                <input
                    className="slider-value"
                    type="number"
                    value={saturation}
                    onChange={(e) => handleChange('saturation', e.target.value)}
                />
            </div>

            <div className="slider-container">
                <label className="slider-label" htmlFor="exposition">Exposition</label>
                <input
                    className="slider"
                    type="range"
                    id="exposition"
                    min="-100"
                    max="100"
                    value={exposition}
                    onChange={(e) => handleChange('exposition', e.target.value)}
                />
                <input
                    className="slider-value"
                    type="number"
                    value={exposition}
                    onChange={(e) => handleChange('exposition', e.target.value)}
                />
            </div>
            <div className="slider-container">
                <label className="slider-label" htmlFor="temperature">Temperature (Kelvin)</label>
                <input
                    className="slider"
                    type="range"
                    id="temperature"
                    min="1000"
                    max="8000"
                    value={temperature}
                    onChange={(e) => handleChange('temperature', e.target.value)}
                />
                <input
                    className="slider-value"
                    type="number"
                    min="1000"
                    max="8000"
                    value={temperature}
                    onChange={(e) => handleChange('temperature', e.target.value)}
                />
            </div>

            <div className="slider-container">
                <label className="slider-label" htmlFor="blur">Blur</label>
                <input
                    className="slider"
                    type="range"
                    id="blur"
                    min="0"
                    max="25"
                    value={blur}
                    onChange={(e) => handleChange('blur', e.target.value)}
                />
                <input
                    className="slider-value"
                    type="number"
                    value={blur}
                    onChange={(e) => handleChange('blur', e.target.value)}
                />
            </div>

            <div className="slider-container">
                <label className="slider-label" htmlFor="inversion">Inversion</label>
                <input
                    className="slider"
                    type="range"
                    id="inversion"
                    min="0"
                    max="100"
                    value={inversion}
                    onChange={(e) => handleChange('inversion', e.target.value)}
                />
                <input
                    className="slider-value"
                    type="number"
                    value={inversion}
                    onChange={(e) => handleChange('inversion', e.target.value)}
                />
            </div>

            <button id="reset-adjust" onClick={resetAdjust}>
                Return to Default
            </button>
        </div>
    );
};
export default AdjustTool;