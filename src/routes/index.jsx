import React from "react";
import indexRoutes from "./route.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import UserRoutes from "./UserRoutes.jsx";

const AppComponent = () => {
  return <>
  { indexRoutes.map((prop, key) => {
    if(prop.AccessType === 'Admin') {
       return <AdminRoutes prop={prop} key={key} keys={key} />
      } else {
        return <UserRoutes prop={prop} key={key} keys={key} />
      }  
    })
  }
  </>
}

export default AppComponent




/* const Root = ({ refetch, session }) =>
<Switch>
{indexRoutes.map((prop, key) => {
 if (prop.path == '/') {
    return <Route exact path={prop.path} render={props => {     
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
  }} key={key} />;
  } else {
    return <Route path={prop.path} render={props => {
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
  }} key={key} />;
  }   
})}
</Switch>
;

const AppComponent = withSession(Root);

export default AppComponent; */


