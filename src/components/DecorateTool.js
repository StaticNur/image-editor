import React, { useEffect, useState } from 'react';

export const DecorateTool = ({ iconEllipse, iconRectangle, iconLine, onAddShape, onDecorateUpdate }) => {
    const [colorElements, setColor] = useState('#FFFF00');

    useEffect(() => {
        onDecorateUpdate({ colorElements });
    }, [colorElements]);

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
            <label htmlFor="color-elements">Color</label>
            <input type="color" id="color-elements" value={colorElements} onChange={e => setColor(e.target.value)} />
        </div>
    );
};

export default DecorateTool;
