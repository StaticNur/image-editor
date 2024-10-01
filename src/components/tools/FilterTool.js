import React, { useState } from 'react';


export const FilterTool = ({ imageSrc, handleFilterClick }) => {

    const [selectedFilter, setSelectedFilter] = useState('none');

    // Обработчик клика по кнопке фильтра
    const handleClick = (filter) => {
        setSelectedFilter(filter); // Устанавливаем выбранный фильтр
        handleFilterClick(filter); // Вызываем функцию родителя
    };

    // Проверка, активен ли фильтр
    const isSelected = (filter) => filter === selectedFilter;

    return (
        <div className="tool filters">
            <div className="elements">
                <div>
                    <button id="filter-none" className={`filter-none ${isSelected('none') ? 'selected' : ''}`} onClick={() => handleClick('none')}>
                        <div className='imageForFiltor none'>
                            <img src={imageSrc} alt="filter none" title="apply a filter none" />
                        </div>
                    </button>
                    <p htmlFor="filter-none" className='lebel-for-filter'>None</p>
                </div>

                <div>
                    <button id="filter-black-white" className={`filter-black-white ${isSelected('grayscale') ? 'selected' : ''}`} onClick={() => handleClick('grayscale')}>
                        <div className='imageForFiltor black-white'>
                            <img src={imageSrc} alt="filter black/whit" title="apply a filter black/whit" />
                        </div>
                    </button>
                    <p htmlFor="filter-black-white" className='lebel-for-filter'>Black&<br />White</p>
                </div>

                <div>
                    <button id="filter-sepia" className={`filter-sepia ${isSelected('sepia') ? 'selected' : ''}`} onClick={() => handleClick('sepia')}>
                        <div className='imageForFiltor sepia'>
                            <img src={imageSrc} alt="filter sepia" title="apply a filter sepia" />
                        </div>
                    </button>
                    <p htmlFor="filter-sepia" className='lebel-for-filter'>Sepia</p>
                </div>

                <div>
                    <button id="filter-vintage" className={`filter-vintage ${isSelected('vintage') ? 'selected' : ''}`} onClick={() => handleClick('vintage')}>
                        <div className='imageForFiltor vintage'>
                            <img src={imageSrc} alt="filter vintage" title="apply a filter vintage" />
                        </div>
                    </button>
                    <p htmlFor="filter-vintage" className='lebel-for-filter'>Vintage</p>
                </div>

            </div>
        </div>
    );
};
export default FilterTool;