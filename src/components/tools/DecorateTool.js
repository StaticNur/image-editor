import React, { useEffect, useState } from 'react';
import iconEllipse from '../../assets/images/icon-ellipse.png';
import iconRectangle from '../../assets/images/icon-rectangle.png';
import iconLine from '../../assets/images/icon-line.png';

export const DecorateTool = ({ onAddShape, onDecorateUpdate }) => {
    const [colorElements, setColor] = useState('#FFFF00');
    const [widthLine, setWidthLine] = useState(5);

    useEffect(() => {
        onDecorateUpdate({ colorElements, widthLine });
    }, [colorElements, widthLine, onDecorateUpdate]);

    const handleWidthLine = (value) => {
        // Проверка корректного ввода и обновление ширины линии
        const newValue = Math.max(1, value); // Убедиться, что ширина линии не меньше 1
        if (value > 0) {
            setWidthLine(newValue);
        }
    }
    return (
        <div className="tool decorate">
            <label htmlFor="rectangle">Shapes</label>
            <div className="elements">
                <button id="circle" className="circle" onClick={() => onAddShape('circle')}>
                    <img src={iconEllipse} className="ellipse-img" alt="ellipse" title="Put ellipse" />
                </button>
                <button id="rectangle" className="rectangle" onClick={() => onAddShape('rectangle')}>
                    <img src={iconRectangle} className="rectangle-img" alt="rectangle" title="Put rectangle" />
                </button>
                <button id="line" className="line" onClick={() => onAddShape('line')}>
                    <img src={iconLine} className="line-img" alt="line" title="Put line" />
                </button>
            </div>
            <div className='settings-shape'>
                <div className='color-shapes'>
                    <label htmlFor="color-elements">Color: </label>
                    <input type="text" className="color-elements-text" id="color-elements" value={colorElements} onChange={e => setColor(e.target.value)} />
                    <input type="color" id="color-elements" value={colorElements} onChange={e => setColor(e.target.value)} />
                </div>
                <div className='color-shapes'>
                    <label htmlFor="width-line">Width line: </label>
                    <input type="number" className='width-line' id="width-line" min={1} value={widthLine} onChange={e => handleWidthLine(e.target.value)} />
                </div>
            </div>
        </div>
    );
};

export default DecorateTool;
