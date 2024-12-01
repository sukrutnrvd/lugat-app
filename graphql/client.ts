import * as SecureStore from "expo-secure-store";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const link = new HttpLink({
  uri: "http://192.168.206.168:3000/graphql",
});

const authLink = setContext(async () => {
  const token = await SecureStore.getItemAsync("token");
  console.log(token);

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
    watchQuery: {
      fetchPolicy: "no-cache",
    },
    mutate: {
      fetchPolicy: "no-cache",
    },
  },
});
