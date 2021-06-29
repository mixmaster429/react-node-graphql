import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

// core components
import Button from "../CustomButtons/Button.jsx";

import defaultImage from "../../assets/img/image_placeholder.jpg";
import defaultAvatar from "../../assets/img/placeholder.jpg";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage,
      path: ''
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  componentWillMount() {
    let {mode, imageUrl} = this.props;
    if (imageUrl) {
      this.setState({
        imagePreviewUrl: mode === 'edit' ? imageUrl : defaultImage
      })
    }
  }

  componentWillReceiveProps(nxtProps) {
    let {mode, imageUrl} = nxtProps;
    if (imageUrl) {
      this.setState({
        imagePreviewUrl: mode === 'edit' ? imageUrl : defaultImage
      })
    }
  }
  
  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      };
    if (file && (file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size < 5000000) {
      this.props.handleSubmit(file);
      reader.readAsDataURL(file);
    } 
    else {
      this.props.handleSubmit(file, 'invalid');
    }
  }
  handleClick() {
    this.refs.fileInput.click();
  }
  handleRemove() {
    this.setState({
      file: null,
      imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage
    });
    this.refs.fileInput.value = null;
    this.props.handleSubmit(null);
  }
  render() {
    var {
      avatar,
      addButtonProps,
    } = this.props;
    return (
      <div className="fileinput text-center">
        <input style={{display:'none'}} type="file" onChange={this.handleImageChange} ref="fileInput" accept=".png, .jpg, .jpeg" />
        <div className={"thumbnail" + (avatar ? " img-circle" : "")}>
          <img src={this.state.imagePreviewUrl ? this.state.imagePreviewUrl : defaultImage} alt="..." height={75}  width={100}/>
        </div>
        <div>
        <Button {...addButtonProps} onClick={() => this.handleClick()}>
        Choose file
        </Button>
          {/* {this.state.file === null ? (
            <Button {...addButtonProps} onClick={() => this.handleClick()}>
              Update
            </Button>
          ) : (
            <span>
              <Button {...changeButtonProps} onClick={() => this.handleClick()}>
                Update
              </Button>
              {avatar ? <br /> : null}
              <Button
                {...removeButtonProps}
                onClick={() => this.handleRemove()}
              >
                <i className="fas fa-times" /> Remove
              </Button>
            </span>
          )} */}
        </div>
      </div>
    );
  }
}

ImageUpload.propTypes = {
  multiple: PropTypes.bool,
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object,
  handleSubmit: PropTypes.func,
  imageUrl: PropTypes.string,
  mode: PropTypes.string
};

export default ImageUpload;
