import React from "react";
import { Query } from "react-apollo";

import { GET_CURRENT_ADMIN } from "../queries";

const withSession = Component => props => (
    <Query query={GET_CURRENT_ADMIN} >
        {({data, loading, refetch}) => {
            if(loading) return null;
            //refetch();
                return (
                    <Component {...props} refetch={refetch} session={data} />
                )
        }}
    </Query>
);

export default withSession;