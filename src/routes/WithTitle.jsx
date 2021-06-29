
import React,{Component} from 'react';
import TitleComponent from './TitleComponent.js'

const withTitle = ({ component: Component }) => {
    return class HOC extends React.Component{
        render(){
            return(
                <React.Fragment>
                <TitleComponent />
                <Component {...this.props} />
             </React.Fragment>
            )
        }
       
    }
  };

  export default withTitle;