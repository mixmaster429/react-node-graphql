import React, {Component} from "react";
import Error from "../../../assets/img/404error.jpg";
import {ProductConsumer } from "../../UserPages/ProductContext.js"
import Header from "../../UserPages/Header/index.jsx"
import {GET_CURRENT_USER} from "../../../queries/index.js"
import { graphql , compose } from "react-apollo";
import {Helmet} from "react-helmet"

class NotFound extends Component{
    goHome = () =>{
        this.props.history.push("/");
    }

    componentWillMount(){
        let { currentUser } = this.props;
        if (!currentUser.getCurrentUser) currentUser.refetch();
        this.setState({
          cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
        });
      }
    
    
      componentWillReceiveProps(nextProps){
        let { currentUser } = nextProps;
        if (!currentUser.getCurrentUser) currentUser.refetch();
        this.setState({
          cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
        });
    
      }

      head() {
        return (
          <Helmet>
            <title>Page NotFound</title>
            {/* <link rel="shortcut icon" href={this.state.favicon} /> */}
          </Helmet>
        );
      }

    render(){
        const { classes, match ,history } = this.props;
        const { cUser } = this.state
        return <div className="notFoundProduct">
        {this.head()}
         <ProductConsumer>
            { value => (  
              <>
              <Header stuffImage={value.stuffImage} categorySubmitted={value.categorySubmitted} CategoryWithImage={value.CategoryWithImage} discardStuffStatus={value.discardStuff} discardYourStuff={value.discardYourStuff} manageBeforeLogin={value.stuffValue} refetchValue={value} setRef={this.setRef} postAnotherListing={value.postAnotherListing} contextConsumerInner={value} showValue={value.showValue} match={match}  history={history} currentUser={cUser}
              postDone={value.postDone} /> 
              </>
           
              )
            }
          </ProductConsumer>
            <img src={Error} alt="empty" width="500"/>
           {/* <h5>The page you're looking for isn't available.</h5> */}
           <h5>Uh oh, we can't seem to find the page you're looking for </h5>
           <h6>Try going back to previous page.</h6>
           <span className="logbtnss" onClick={this.goHome}>Go Back Home</span>
           {/* <div className="newcontacrf"> 
            <Footer/> 
           </div> */}
          </div>;
    }
}

var notfound = compose(
    graphql(GET_CURRENT_USER, { name: "currentUser" })
  )(NotFound);

export default notfound;
