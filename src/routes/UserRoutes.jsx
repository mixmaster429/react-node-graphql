import React, { Component } from "react";
import WithSessionUser from "../hoc/WithsessionUser.js";
import { Route,Switch, Redirect } from "react-router-dom";
import ScrollIntoTop from "../views/UserPages/ScrollIntoTop.js";
import { ApolloConsumer } from "react-apollo";
import { ProviderRefech, ProductConsumer } from "../views/UserPages/ProductContext.js";
import TitleComponent from "./TitleComponent.js";

export class UserRoutesClass extends Component {
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
                                    <>                                    
                                        {
                                        (prop.path === '/') ? <Route exact path={prop.path}  render={ props => ( <prop.component   client={client} contextConsumer={contextConsumer} {...props}
                                        session={session} refetch={refetch} />)} key={keys} /> :(prop.path ==='/EditProfile/:id') ? <Route  exact path={prop.path} render={props =>(session.getCurrentUser !== null && props.match.params.id === session.getCurrentUser.id  ? <prop.component client={client} contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} /> : <Redirect to="/" />)} key={keys} /> :(prop.path === '/chat/coversation') ? <Route exact path={prop.path} render={props =>(session.getCurrentUser !== null ? <prop.component
                                        client={client} contextConsumer={contextConsumer} {...props}
                                        session={session} refetch={refetch} /> : <Redirect to="/" />)}
                                        key={keys} /> : <Route exact path={prop.path} render={ props => (
                                        <prop.component contextConsumer={contextConsumer} client={client}
                                        {...props} session={session} refetch={refetch} /> )} key={keys} />
                                        }                                    
                                    </>
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
        /* if (prop.path == '/') {
            return <Switch>
                <Route exact path={prop.path} render={props => {     
                    return (
                        <>
                        <ScrollIntoTop>
                        <ProviderRefech>
                            <ProductConsumer>
                                { contextConsumer => (
                                <prop.component contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} />
                                )}
                            </ProductConsumer>
                            </ProviderRefech>
                        </ScrollIntoTop>
                        </>
                    )
                }} key={keys} />
            </Switch>
        } else {
            if(prop.path === '/EditProfile/:id') {
                return <>
                    <ScrollIntoTop>
                        <ApolloConsumer>
                        { client => (
                            <>
                                <ProviderRefech>
                                    <ProductConsumer>
                                        { contextConsumer => (
                                            <Route path={prop.path} render={props => (session.getCurrentUser !== null && props.match.params.id === session.getCurrentUser.id ? <prop.component client={client} contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} /> : <Redirect to="/" />)}
                                            />
                                        )}
                                    </ProductConsumer>
                                </ProviderRefech>
                            </>
                        )}
                        </ApolloConsumer>
                    </ScrollIntoTop>
                </>
            } else if(prop.path === '/chat') {
                return <>
                    <ScrollIntoTop>
                        <ApolloConsumer>
                        { client => (
                            <>
                                <ProviderRefech>
                                    <ProductConsumer>
                                        { contextConsumer => (
                                            <Route path={prop.path} render={props => (session.getCurrentUser !== null ? <prop.component client={client} contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} /> : <Redirect to="/" />)}
                                            />
                                        )}
                                    </ProductConsumer>
                                </ProviderRefech>
                            </>
                        )}
                        </ApolloConsumer>
                    </ScrollIntoTop>
                </>
            } else {
                return <Switch>
                    <Route path={prop.path} render={props => {
                        return (
                            <>
                            <ScrollIntoTop>
                            <ApolloConsumer>
                                { client =>(
                                <>
                                    <ProviderRefech>
                                        <ProductConsumer>
                                            { contextConsumer => (
                                            <prop.component contextConsumer={contextConsumer} client={client} {...props} session={session} refetch={refetch} />                    
                                            )}
                                        </ProductConsumer>
                                    </ProviderRefech>
                                </>
                                )}
                            </ApolloConsumer>
                            </ScrollIntoTop>
                            </>
                        )
                    }} key={keys} />                
                </Switch>
            }
        }  */     
    }
}
const UserRoutes = WithSessionUser(UserRoutesClass)

export default UserRoutes
