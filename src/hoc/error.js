import React, { Component } from "react";

export default class ErrorNotFound extends Component {

    render() {
        //console.log(this.props, 'ErrorNotFound');
        return (
            <div>
                <h1>{this.props.error.message}</h1>
            </div>
        );
    }
}