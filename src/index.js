import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache, ApolloClient } from "apollo-boost";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "apollo-utilities";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import "react-toastify/dist/ReactToastify.css";
import AppComponent from "./routes/index.jsx";
import { resolvers, defaults } from "./resolver.js";
import { getSymbol } from "./helper.js";

import { I18nextProvider } from "react-i18next";
import i18next from "i18next";

import common_fr from "./translations/fr/common.json";
import common_en from "./translations/en/common.json";
import common_ar from "./translations/ar/common.json";

const { REACT_APP_URL, REACT_APP_Site_Url, REACT_APP_WS_URL } = process.env;

/* const uploadLink = createUploadLink({
  uri: 
  REACT_APP_ENV == 'production' ?
  `${REACT_APP_URL+REACT_APP_Site_Url}/graphql` :
  `${REACT_APP_URL+'localhost:'+REACT_APP_Port}/graphql` ,
  credentials: 'include'
}); */

//console.log = console.error = console.warn = function() {}

const uploadLink = createUploadLink({
  uri: `${REACT_APP_URL + REACT_APP_Site_Url}/graphql`,
  credentials: "include"
});

const wsLink = new WebSocketLink({
  uri: REACT_APP_WS_URL,
  options: {
    reconnect: true
  }
});
const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  uploadLink
);

const link = ApolloLink.from([terminatingLink]);
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const defaultLng = localStorage.getItem("lang");
  if (defaultLng === null) {
    localStorage.setItem("lang", "en");
  }
  operation.setContext({
    headers: {
      lang: window.location.pathname.includes("admin")
        ? "en"
        : localStorage.getItem("lang"),
      currency: localStorage.getItem("currency")
    }
  });
  return forward(operation);
});

const cache = new InMemoryCache({addTypename: false});
const client = new ApolloClient({
  link: authMiddleware.concat(link),
  //link,
  cache,
  defaults,
  resolvers
});

const defaultLng = localStorage.getItem("lang");
let arr = ["ar", "fr", "en"];
if (!arr.includes(localStorage.getItem("lang"))) {
  // localStorage.getItem("langList");
  localStorage.setItem("lang", "en");
}

if (defaultLng === null) {
  localStorage.setItem("lang", "en");
}
if (!localStorage.getItem("currency")) {
  localStorage.setItem("currency", "USD");
  localStorage.setItem("currencySymbol", getSymbol("&#36;"));
}
const rtl = localStorage.getItem("rtl");
if (defaultLng === "ar" && !window.location.pathname.includes("admin")) {
  document.body.setAttribute("dir", rtl);
} else {
  document.body.removeAttribute("dir", rtl);
}

i18next.init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem("lang"),
  resources: {
    en: {
      common: common_en
    },
    fr: {
      common: common_fr
    },
    ar: {
      common: common_ar
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <I18nextProvider i18n={i18next}>
        <AppComponent />
      </I18nextProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.querySelector("#root")
);
