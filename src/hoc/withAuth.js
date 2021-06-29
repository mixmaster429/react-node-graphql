import React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import { GET_CURRENT_ADMIN } from "../queries";
import Error from "./error.js";


const withAuth = conditionFunc => Component => props => { 
    return (
    <Query query={GET_CURRENT_ADMIN}>
    {({ data, loading, error }) => {
        if (loading){
            return null;
        } 
        if (error){
            return <div><Error error={error}/></div>;
        } 
        if (!props.session || !props.session.getCurrentAdmin){
            return <Redirect to="/admin/login" />;
        } 
        if(props.session  && (props.location.pathname === "/admin/" || props.location.pathname === "/admin") ){
            return <Redirect to="/admin/dashboard" />;
        } 
        return conditionFunc(data) ? <Component {...props} /> : <Redirect to="/admin/login" />
    }}
    </Query>
    )
};

export default withAuth;
