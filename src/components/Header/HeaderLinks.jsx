import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";

// @material-ui/icons
import PowerSetting from "@material-ui/icons/PowerSettingsNewRounded";

// core components
import Button from "../../components/CustomButtons/Button.jsx";
import headerLinksStyle from "../../assets/jss/material-dashboard-pro-react/components/headerLinksStyle.jsx";
import Modal from "react-modal";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                  : '30%',
    padding                : '25px'
  }
};


class HeaderLinks extends React.Component {
  state = {
      open: false,
      DeletePopup: false
    };
  // handleClick = () => {
  //   this.setState({ open: !this.state.open });
  // };
  handleClose = () => {
    // if (this.state.open) {
      // Cookies.remove('token');
      this.props.prop.handleLogout();
    // }
    // this.setState({ open: false });
    this.setState({
      DeletePopup: false
    })

  };


  handlePopup = () =>{
    this.setState({
      DeletePopup :true
    })
  }

  handleCloseModal = () =>{
      this.setState({...this.state.DeletePopup}, () => {
        this.setState({
          DeletePopup: false
        })
      });  
   
  }


  render() {
    const { classes, rtlActive } = this.props;
    const { open,DeletePopup } = this.state;
    const wrapper = classNames({
      [classes.wrapperRTL]: rtlActive
    });
    return (
      <div className={wrapper}>
        <Button
          title="Logout"
          color="transparent"
          aria-label="Person"
          open={open ? "menu-list" : null}
          onClick={this.handlePopup}
          justIcon
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : ""
          }}
        >
          <Modal 
          isOpen={DeletePopup}
          contentLabel="Minimal Modal Example"
          style={customStyles}
          ariaHideApp={false}
        >
          <section className="iHQQug">                             
          
            {
              <>
              <div className="bwXZIf"> 
                <header> <h1> Logout Session</h1></header>
              </div>
              <article><span>You're going to Logout this session</span></article>
              <div class="sav_chang cancee">                                      
                <button type="submit" onClick={e => this.handleClose()}  class="btn btn-danger btn-block">Logout</button>
              </div>
            <div class="sav_chang">
              <button type="submit" onClick={this.handleCloseModal}
              class="btn iDhWYa btn-block">Cancel</button>
            </div> 
            </> } 
          </section> 
         
        </Modal>
        <PowerSetting />
          <Hidden mdUp implementation="css">
            <span className={classes.linkText}>
              {rtlActive ? "الملف الشخصي" : "Profile"}
            </span>
          </Hidden>
        </Button>
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool
};

export default withStyles(headerLinksStyle)(HeaderLinks);
