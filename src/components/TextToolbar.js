import React, { useEffect, useState } from 'react';


export const TextToolbar = ({ onAddShape, iconT, iconTextLeft,
    iconTextCenter, iconTextRight, iconTextAll, onTextUpdate }) => {

    const [font, setFont] = useState('Avenir Next');
    const [size, setSize] = useState(12);
    const [style, setStyle] = useState({ bold: false, italic: false, underline: false, strikethrough: false });
    const [alignment, setAlignment] = useState('left');
    const [color, setColor] = useState('#FFFF00');

    // Trigger when any text attribute changes
    useEffect(() => {
        onTextUpdate({ font, size, style, alignment, color });
    }, [font, size, style, alignment, color]);

    return (
        <div className="tool text">
            <button id="toggleTextModeButton" onClick={() => onAddShape('text')}>
                <img src={iconT} alt="" title="Enable Text Mode" />
            </button>
            <label htmlFor="font">Font</label>
            <select id="font" className="font-select" value={font} onChange={e => setFont(e.target.value)}>
                <option value="Avenir Next">Avenir Next</option>
                <option value="Arial">Arial</option>
                <option value="Impact">Impact</option>
                <option value="Book Antiqua">Book Antiqua</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
            </select>

            <label htmlFor="size">Size</label>
            <select id="size" className="size-select" value={size} onChange={e => setSize(e.target.value)}>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
                <option value="24">24</option>
            </select>

            <div className="style">
                <button className="b" onClick={() => setStyle(prev => ({ ...prev, bold: !prev.bold }))}>B</button>
                <button className="i" onClick={() => setStyle(prev => ({ ...prev, italic: !prev.italic }))}>I</button>
                <button className="u" onClick={() => setStyle(prev => ({ ...prev, underline: !prev.underline }))}>U</button>
                <button className="s" onClick={() => setStyle(prev => ({ ...prev, strikethrough: !prev.strikethrough }))}>S</button>
            </div>

            <div className="alignment">
                <button onClick={() => setAlignment('left')}>
                    <img src={iconTextLeft} className="text-alignment-left" alt="text-alignment-left" title="left-aligned text" />
                </button>
                <button onClick={() => setAlignment('center')}>
                    <img src={iconTextCenter} className="text-alignment-center" alt="text-alignment-center" title="center-aligned text" />
                </button>
                <button onClick={() => setAlignment('right')}>
                    <img src={iconTextRight} className="text-alignment-right" alt="text-alignment-right" title="right-aligned text" />
                </button>
                <button onClick={() => setAlignment('justify')}>
                    <img src={iconTextAll} className="text-alignment-justify" alt="text-alignment-justify" title="justify-aligned text" />
                </button>
            </div>

            <label htmlFor="color">Color</label>
            <input type="color" id="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
    );
};
export default TextToolbar;