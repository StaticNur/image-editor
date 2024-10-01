import React, { useState } from 'react';
import iconCrop from '../assets/images/icon-crop.png';
import iconResize from '../assets/images/icon-resize.png';
import iconRepeat from '../assets/images/icon-repeat.png';
import iconSliders from '../assets/images/icon-sliders.png';
import iconFilters from '../assets/images/icon-filters.png';
import iconT from '../assets/images/icon-t.png';
import iconStar from '../assets/images/icon-star.png';
import iconPencil from '../assets/images/icon-edit.png';

export const SidebarMenu = ({ handleToolClick }) => {
    const [selectedOption, setSelectedOption] = useState('crop');

    const handleClick = (tool) => {
        setSelectedOption(tool);  // Установить выбранную опцию
        handleToolClick(tool);    // Вызвать родительскую функцию
    };

    return (
        <div className="options">
            <div className={`option ${selectedOption === 'crop' ? 'selected' : ''}`} id="cropOption" onClick={() => handleClick('crop')}>
                <img src={iconCrop} alt='crop' />
                <span>Crop</span>
            </div>
            <div className={`option ${selectedOption === 'resize' ? 'selected' : ''}`} id="resizeOption" onClick={() => handleClick('resize')}>
                <img src={iconResize} alt='resize' />
                <span>Resize</span>
            </div>
            <div className={`option ${selectedOption === 'rotate-flip' ? 'selected' : ''}`} id="rotateOption" onClick={() => handleClick('rotate-flip')}>
                <img src={iconRepeat} alt='rotate-flip' />
                <span>Rotate and Flip</span>
            </div>
            <div className={`option ${selectedOption === 'adjust' ? 'selected' : ''}`} id="adjustOption" onClick={() => handleClick('adjust')}>
                <img src={iconSliders} alt='adjust' />
                <span>Adjust</span>
            </div>
            <div className={`option ${selectedOption === 'filters' ? 'selected' : ''}`} id="filtersOption" onClick={() => handleClick('filters')}>
                <img src={iconFilters} alt='filters' />
                <span>Filters</span>
            </div>
            <div className={`option ${selectedOption === 'text' ? 'selected' : ''}`} id="textOption" onClick={() => handleClick('text')}>
                <img src={iconT} alt='text' />
                <span>Text</span>
            </div>

            <div className={`option ${selectedOption === 'pencil' ? 'selected' : ''}`} id="pencilOption" onClick={() => handleClick('pencil')}>
                <img src={iconPencil} alt='pencil' />
                <span>Draw</span>
            </div>

            <div className={`option ${selectedOption === 'decorate' ? 'selected' : ''}`} id="elementsOption" onClick={() => handleClick('decorate')}>
                <img src={iconStar} alt='decorate' />
                <span>Elements</span>
            </div>
        </div>
    );
};

export default SidebarMenu;
