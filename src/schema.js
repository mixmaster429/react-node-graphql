import gql from "graphql-tag";

const SET_TOGGLE = gql`
mutation SetToggle($value: Boolean!) {
  toggle(filter: $filter) @client
}
`;