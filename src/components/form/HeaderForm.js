import React from 'react';
import closeButton from '../../assets/images/closeButton.png';


export const HeaderForm = ({ hideEditForm }) => {

    return (
        <div className="form-header">
            <h3>Image Editor</h3>
            <img src={closeButton} alt="close button" title="close edit-form" onClick={hideEditForm} />
        </div>
    );
};
export default HeaderForm;