import React from 'react';
import iconDownload from '../assets/images/icon-download.png';
import iconReload from '../assets/images/icon-reload.png';
import iconDelete from '../assets/images/icon-delete.png';
import iconPlus from '../assets/images/icon+.png';
import iconEdit from '../assets/images/icon-edit.png';

export const ImageUploadUI = ({ dropAreaRef, fileInputRef, handleDrop,
  handleFileChange, handleRefresh, handleEdit, handleRemove, image, handleDownload }) => {
  return (
    <div className="upload">
      <div className={`choose_image ${image.src !== '' ? 'hidden' : 'block'}`}>
        <div
          className="upload_img_box"
          ref={dropAreaRef}
          id='drop-area'
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => dropAreaRef.current.classList.add('dragover')}
          onDragLeave={() => dropAreaRef.current.classList.remove('dragover')}
          onDrop={handleDrop}
        >
          <label htmlFor="selectedImage">
            <img src={iconPlus} alt="icon + load" title="upload an image" />
          </label>
          <input
            type="file"
            id="selectedImage"
            accept="image/jpeg, image/png"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <p id="hint">
            Drop file to upload<br />or select file<br />
            <span style={{ color: '#7B828E' }}>5 MB Max, JPEG, PNG, GIF, SVG</span>
          </p>
        </div>
      </div>

      {image.src !== '' && (
        <div className={`image_holder block`}>
          <div className="img_btns" id="img_btns">
            <p>Image</p>
            <button onClick={handleRefresh}>
              <img src={iconReload} alt="" title="refresh foto" />
            </button>
            <button onClick={handleEdit}>
              <img src={iconEdit} alt="" title="edit foto" />
            </button>
            <button onClick={handleDownload}>
              <img src={iconDownload} alt="" title="Download foto" />
            </button>
            <button onClick={handleRemove}>
              <img src={iconDelete} alt="" title="delete foto" />
            </button>
          </div>
          <div id="loader" className="loader" style={{ display: 'none' }}></div>
          <img src={image.src}
            alt="img"
            id="image"
            className="main-image"
            style={{ width: image.width, height: image.height }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadUI;
