import React from "react";
import PropTypes from "prop-types";
import { compose, graphql } from "react-apollo";
import { GET_CATEGORIES, CATEGORY_ID, GET_CATEGORY_ID, GET_REDIRECTFILTER_STATE,REDIRECT_HOME_FILTER  } from "../../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import deleteButton from "../../../../assets/img/delete.png";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { withTranslation } from "react-i18next";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      clicked: false,
      categoryId: null,
      preventSpeedClick: true
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    let { categoryInfo } = this.props;
    let categories = [];
    if(localStorage.getItem("lang")){
     categoryInfo.refetch().then(({ data }) => {
      if (data) {
        categories = data.getCategoryDetails && data.getCategoryDetails.category;
        this.setState({
          categories: categories
        })
      }
    }).catch(e => console.log(e));
    }
  }

  componentDidUpdate(prevProps, prevState) {
     if(prevProps.categoryList !== this.props.categoryList){
     const list = this.props.categoryList ? this.props.categoryList : [];
     this.setState({
      categories: list
     })
   }
  }
  
  handleClick = (id, type, image) => {
    this.props.getCategoryId({ variables: { categoryId: id } });
    this.setState({ categoryId: id });
  }
  imageClick = () => {
    if (this.state.preventSpeedClick) {
      this.setState({
        clicked: true
      })
      this.props.getCategoryId({ variables: { categoryId: "" } })
      this.props.redirectHomeFilter({ variables: { pageCountFilter: true } });
      this.props.AdvancedFiltersubmit({
        fieldChild: [],
        rangeFilter : []
      });
      this.setState({ categoryId: ""});
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.clearFilter !== this.props.clearFilter) {
      this.imageClick()
    }
    if (nextProps.getCacheCategoryData.categoryId !== this.props.getCacheCategoryData.categoryId) {
      if (this.state.preventSpeedClick) {
        this.setState({ 
          categoryId: nextProps.getCacheCategoryData.categoryId.toString(), 
          preventSpeedClick: false ,
        });
        setTimeout(() => {
          this.props.getCategoryId({ variables: { categoryId: nextProps.getCacheCategoryData.categoryId.toString() } });
          this.setState({ preventSpeedClick: true });
        }, 200);
      }
    }
  }

  render() {
    let { categories } = this.state;
    let { classes,getCacheCategoryData } = this.props;
    let alignClass = categories.length > 14 ? " rm_align" : "";
    return (
      <div className={classes.dUMWSw}>
        <div className={classes.blMHsv + " " + "resview"}>
          <div className={classes.nqLdW}>
            <div className={classes.ziseO}>
              <div className={classes.hXGgNA + " " + classes.fkJmKQ + alignClass + " " + "respcatrr"}>
                {categories.map(c => {
                  return (
                    <div className={
                      classes.eTPvTw +
                      (getCacheCategoryData.categoryId ? ((c.id !== getCacheCategoryData.categoryId ? " opLow" : "")) : "") + " " + "fullwidcare"} title={c.name}>
                      <div className={classes.alignSelf + " " + "respoiconvew"} >
                        <a>
                          <img src={c.image} alt="" width={56} height={56} onClick={() => this.handleClick(c.id, c.type, c.image)} />
                          {c.id === getCacheCategoryData.categoryId ? <div className={"delete" + " " + "fffd"} onClick={this.imageClick}>
                            {/* <button className={classes.dioYWW}> */}
                              <img className={classes.eBmutg + " " + "newresimg"} src={deleteButton} alt="" width={20} height={20} />
                              {this.state.clicked}
                            {/* </button> */}
                            </div>
                             : ""}
                        </a>
                      </div>
                      <a className={classes.textAlign + " " + "resttest text-truncate"} >{c.name.length > 16 ? c.name.slice(0, 15) + "..." : c.name}</a>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
Category.propTypes = {
  onClick: PropTypes.func
};

var CategoryFilter = compose(
  
  graphql(GET_CATEGORIES, {
    name: "categoryInfo", options: () => ({
      fetchPolicy: "no-cache"
    })
 }),
 
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(GET_CATEGORY_ID, { name: "getCacheCategoryData", options: () => ({ fetchPolicy: "cache-only" }) }),

  graphql(REDIRECT_HOME_FILTER, {
    name: "redirectHomeFilter"
  }),
  graphql(GET_REDIRECTFILTER_STATE, {
    name: "pageCountFilter",
    options: () => ({
      fetchPolicy: 'cache-only'
    })
  })
)(Category);

export default withTranslation("common") (withStyles(styles)(CategoryFilter));
