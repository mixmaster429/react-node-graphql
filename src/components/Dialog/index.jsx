/*eslint-disable*/
import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
import Close from "@material-ui/icons/Close";

// core components
import Button from "../CustomButtons/Button.jsx";

import notificationsStyle from "../../assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class DialogUpdate extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClickOpen() {
    this.props.handleClickOpen();
  }
  handleClose() {
    this.props.handleClose();
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
        // classes={{
        //   root: classes.center + " " + classes.modalRoot,
        //   paper: classes.modal + " " + classes.modalSmall
        // }}
        open={this.props.open}
       // TransitionComponent={Transition}
        keepMounted
        onClose={() => this.handleClose("noticeModal")}
        aria-labelledby="small-modal-slide-title"
        aria-describedby="small-modal-slide-description"
        >
        <DialogTitle
        id="small-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
        >
        Confirm Delete
        <Button
          justIcon
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="transparent"
          onClick={() => this.handleClose()}
        >
        <Close className={classes.modalClose} />
        </Button>
        </DialogTitle>
        <DialogContent
        id="small-modal-slide-description"
        className={
          classes.modalBody + " " + classes.modalSmallBody
        }>
        <p>You are about to delete one track, this procedure is irreversible.</p>
        <p>Do you want to proceed?</p>
        </DialogContent>
        <DialogActions
          className={
            classes.modalFooter +
            " " +
            classes.modalFooterCenter 
          }
        >
        <Button
          onClick={() => this.handleClose()}
          className={classes.modalSmallFooterFirstButton + " " + {backgroundColor: "grey", marginRigt: "10px"}}
        >
          Cancel
        </Button>
        <Button
          onClick={() => this.handleClickOpen()}
          className={
            classes.modalSmallFooterFirstButton +
            " " +
            classes.modalSmallFooterSecondButton +
            " " +
            {marginLeft: "10px !important"}
          }
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </div>
    );
  }
}

DialogUpdate.defaultProps = {
  open: false
};

DialogUpdate.propTypes = {
    open: PropTypes.bool,
    handleClickOpen: PropTypes.func,
    handleClose: PropTypes.func
};

export default withStyles(notificationsStyle)(DialogUpdate);
