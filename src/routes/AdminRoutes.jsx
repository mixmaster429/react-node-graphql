import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import withSession from "../hoc/withSession.js";
import ScrollIntoTop from "../views/UserPages/ScrollIntoTop.js";
import { ApolloConsumer } from "react-apollo";
import { ProviderRefech, ProductConsumer } from "../views/UserPages/ProductContext.js";
import TitleComponent from "./TitleComponent.js";

export class AdminRoutesClass extends Component {
    render() {
        const { prop, keys, session, refetch } = this.props;        
        return (
            <Switch>
                <Route path={prop.path} render={props => {           
                    return (
                    <div>
                    <TitleComponent titleProps={props} />
                    <ScrollIntoTop>
                        <ApolloConsumer>
                        { client =>(
                            <div>
                            <ProviderRefech>
                                <ProductConsumer>
                                { contextConsumer => (
                                    <prop.component contextConsumer={contextConsumer} client={client} {...props} session={session} refetch={refetch} />                  
                                )}
                                </ProductConsumer>
                            </ProviderRefech>
                            </div>
                        )}
                        </ApolloConsumer>
                    </ScrollIntoTop>
                    </div>
                    )
                }} key={keys} />
            </Switch>
        )
    }
}

const AdminRoutes = withSession(AdminRoutesClass)

export default AdminRoutes
