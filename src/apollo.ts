import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { MeMenus } from "./pages/Me";
import { UserProfileMenus } from "./pages/UserProfile";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

export interface newMsgManagerProps {
  id: number;
  prevMsg: number;
  newMsg: number;
}
export const TOKEN_NAME = "randummy_auth_token";
const TOKEN = localStorage.getItem(TOKEN_NAME);
export const isLoggedIn = makeVar(Boolean(TOKEN));
export const authToken = makeVar(TOKEN);
export const currentHomePage = makeVar(1);
export const currentMeMenu = makeVar(MeMenus.UsernameMenu);
export const currentUserProfileMenu = makeVar(UserProfileMenus.UsernameMenu);
export const newMsgManager = makeVar<newMsgManagerProps[]>([]);

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? `${process.env.REACT_APP_BASE_BACKEND_HTTPS_URL}/graphql`
      : `${process.env.REACT_APP_BASE_LOCAL_BACKEND_HTTP_URL}/graphql`,
});

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? `${process.env.REACT_APP_BASE_BACKEND_WS_URL}/graphql`
      : `${process.env.REACT_APP_BASE_LOCAL_BACKEND_WS_URL}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      "x-jwt": authToken() || "",
    },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authToken() || "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
