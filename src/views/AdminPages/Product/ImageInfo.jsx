import React from "react";
import ReactDOMServer from "react-dom/server";

//react dropzone for image upload
import DropzoneComponent from "react-dropzone-component";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormHelperText from  "@material-ui/core/FormHelperText";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";

// style component
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

const style = {
  ...extendedFormsStyle,
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  }
};

const initialState = {
  images: [],
  imagePreviewUrl: [],
  deleteImages: [],
  errors: "",
  validCount: 0
};

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
  }

  componentWillMount() {
    let {match, data} = this.props;
    const id = match.params.id;
    if (id) {
      // let currentProduct = (data && data.getAdminByProduct) && data.getAdminByProduct.find((data) => {
      //   return Number(data.id) === Number(id);
      // });
      this.setState({
        imagePreviewUrl: data.getAdminByProduct[0].images
      });
    }
  }

  // componentWillReceiveProps() {
  //   let {match, data} = this.props;
  //   const id = match.params.id;
  //   if (id) {
  //     let currentProduct = (data && data.getProduct) && data.getProduct.find((data) => {
  //       return data.id == id;
  //     });
  //     this.setState({
  //       imagePreviewUrl: currentProduct.images
  //     });
  //   }
  // }

  isValidated() {
    let {match} = this.props;
    const id = match.params.id;
    if (this.state.validCount) {
      this.setState({
        errors: "Please upload the images like JPG,JPEG,PNG File Only"
      });
      return false;
    }
    if ((this.state.imagePreviewUrl && this.state.imagePreviewUrl.length) + 
    (this.state.images && this.state.images.length) > 10) {
        this.setState({
          errors: "Oops! you can upload 10 images only"
        });
        return false;
    }
    if (id && this.state.imagePreviewUrl && this.state.imagePreviewUrl.length) {
      this.setState({
        errors: ""
      });
      return true;
    }
    else if (this.state.images && this.state.images.length) {
      this.setState({
        errors: ""
      });
      return true;
    }
    else if (this.state.images)
    {
      this.setState({
        errors: "Product Images is required"
      });
      return false;
    }
  }

  handleAdd(file) {
    if (!file.url) {
      var allFiles = this.state.images;
      allFiles = allFiles.concat([file]);
      this.setState({
        images: allFiles,
        errors: ""
      });
    }
  }

  handleRemove(file) {
    var count;
    if (file.url) {
      var del = this.state.deleteImages;
      var delName = file.url.split("/");
      var fileName = delName[delName.length-1];
      del.push(fileName);
      var pre = this.state.imagePreviewUrl;
      pre.forEach((url, i) => {
        if (url === file.url) {
          pre.splice(i, 1);
        }
      })
      this.setState({
        deleteImages: del,
        imagePreviewUrl: pre
      });
    } else {
      let images = this.state.images;
      images.forEach((img, i) => {
        if (file.status === "error") {
          count = this.state.validCount - 1;
        }
        if (file.upload.uuid === img.upload.uuid) {
          images.splice(i, 1);
        }
      });
      this.setState({
          images,
        validCount: count
      })
    }
  }

  sendState() {
    return this.state;
  }

  preloadImages(dropzone) {
    (this.state.imagePreviewUrl || []).forEach( function (i) {
        var name = i.split("/");
        var file = { url: i, name: name[name.length-1] };
        // var width = 100;
        // var height = 100;
        //var imageUrl = ImageService.resize(i.url, width, height);

        dropzone.emit("addedfile", file);
        dropzone.emit("thumbnail", file, i);
        dropzone.emit("complete", file);
    });
}

  render() {
    var self = this;
    return (
      <GridContainer style={{display: "block"}}>
        <FormHelperText  style={{padding: "0 0 10px 10px"}} error={!!this.state.errors}>
        {this.state.errors + (this.state.errors &&" *")}
        </FormHelperText>
        <div style={{padding: "0 0 0 10px"}}>
        <DropzoneComponent 
        config={{
          postUrl: "no-url",
          iconFiletypes: [".jpg", ".png"],
          showFiletypeIcon: true
        }}
        eventHandlers=
        {{
          
          addedfile: (file) => this.handleAdd(file), 
          removedfile: (file) => this.handleRemove(file),
          init: (dropzone) => {
            //console.log(dropzone);
              dropzone.autoDiscover = false;
              self.preloadImages(dropzone);
          },
          error: (file) => {
            if (file.status === "error") {
              var count = (this.state.validCount ? this.state.validCount : 0) + 1;
              this.setState({
                validCount: count
              });
            }
          }
        }}
        djsConfig={{
          acceptedFiles: "image/jpeg,image/png,image/jpg",
          autoProcessQueue: false,
          clickable: true,
          thumbnailWidth:"400",  //415
          thumbnailHeight:"400", //375
          createImageThumbnails: true,
          dictInvalidFileType : "invalid file type",
          dictDefaultMessage: ReactDOMServer.renderToStaticMarkup(
            <div className="dz-clickable">
            <Button color="rose" style={{margin: "0 0 30px 20px"}}>Choose Files</Button>
            </div> 
          ),
          //addRemoveLinks: true,
          previewTemplate: ReactDOMServer.renderToStaticMarkup(
            <div className="dz-preview dz-file-preview dz-clickable" style=
            {{display:"inline-block", margin: "0 20px 40px 20px"}}>
              <div className="dz-details">
              <img height={100} width={150} data-dz-thumbnail="true" alt="" />
          <div style={{display:"block", textAlign:"center", margin: "10px 0 0 0"}} className="dz-error-message">
          <span style={{color: "red"}} data-dz-errormessage="true"></span></div>
                <div style={{display:"block", textAlign:"center", margin: "10px 0 0 0"}}>
                <Button size="sm"  color="rose" data-dz-remove>Remove</Button>
                </div>
              </div>
            </div>
          )}} />
          </div>
      </GridContainer>
    );
  }
}

export default withStyles(style)(Image);
