import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

// core components
import Button from "../CustomButtons/Button.jsx";

import defaultImage from "../../assets/img/image_placeholder.jpg";
import defaultAvatar from "../../assets/img/placeholder.jpg";

export default function ImageUpload(props) {
  const [file, setFile] = React.useState(null);
  const [tempFile, setTempFile] = React.useState(null);
  let { handleFile } = props;
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    props.avatar ? defaultAvatar : defaultImage
  );
  let fileInput = React.createRef();
  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    let tempFileValue;
    if (file) {
      tempFileValue = file;
      setTempFile(tempFileValue);
    }
    let finalFile = file ? file : tempFile;
    if (finalFile.size < 50000 && (finalFile.type === 'image/jpg' || finalFile.type === 'image/png' || finalFile.type === 'image/jpeg') ) {
      reader.onloadend = () => {
        setFile(finalFile);
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(finalFile);
      handleFile(finalFile);
    }else{
      reader.onloadend = () => {
        setFile(null);
        setImagePreviewUrl(props.avatar ? defaultAvatar : defaultImage);
      };
      fileInput.current.value = null;
      handleFile(fileInput);
    }
  };
  // eslint-disable-next-line
  const handleSubmit = e => {
    e.preventDefault();
    // file is the file/image uploaded
    // in this function you can save the image (file) on form submit
    // you have to call it yourself
  };
  const handleClick = () => {
    fileInput.current.click();
  };
  const handleRemove = () => {
    setFile(null);
    setImagePreviewUrl(props.avatar ? defaultAvatar : defaultImage);
    fileInput.current.value = null;
    handleFile(fileInput);
  };
  let {
    avatar,
    addButtonProps,
    changeButtonProps,
    removeButtonProps,
    name,
    imageLink
  } = props;
  return (
    <div className="fileinput text-center">
      <input
        type="file"
        name={name}
        onChange={handleImageChange}
        ref={fileInput}
      />
      <div className={"thumbnail" + (avatar ? " img-circle" : "")}>
        {imageLink && <img src={imageLink} alt="..." />}
        {!imageLink && <img src={imagePreviewUrl} alt="..." />}
      </div>
      <div>
        {file === null ? (
          <Button {...addButtonProps} onClick={() => handleClick()}>
            {avatar ? "Add Photo" : "Select image"}
          </Button>
        ) : (
          <span>
            <Button {...changeButtonProps} onClick={() => handleClick()}>
              Change
            </Button>
            {avatar ? <br /> : null}
            <Button {...removeButtonProps} onClick={() => handleRemove()}>
              <i className="fas fa-times" /> Remove
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object,
  handleFile: PropTypes.func,
  name: PropTypes.string
};
