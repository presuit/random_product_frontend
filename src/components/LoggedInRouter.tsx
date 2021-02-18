import { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Home } from "../pages/Home";
import { Me } from "../pages/Me";
import { Messages } from "../pages/Messages";
import { UserProfile } from "../pages/UserProfile";
import { ValidationCode } from "../pages/ValidateCode";
import "../styles/animation.css";
import { NotValidUser } from "../pages/NotValidUser";
import { Product } from "../pages/Product";
import { CreateProduct } from "../pages/CreateProduct";
import { EditProfile } from "../pages/EditProfile";
import { EditProduct } from "../pages/EditProduct";
import { MsgRoom } from "../pages/MsgRoom";
import { gql, useReactiveVar, useSubscription } from "@apollo/client";
import { receiveMsgCount } from "../__generated__/receiveMsgCount";
import { newMsgManager } from "../apollo";
import { Category } from "../pages/Category";

export const RECEIVE_MSG_COUNT = gql`
  subscription receiveMsgCount {
    receiveMsgCount {
      id
      msgCounts
      createdAt
    }
  }
`;

const routes = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/not-valid-user",
    component: NotValidUser,
  },
  {
    path: "/validate-code",
    component: ValidationCode,
  },
  {
    path: "/me",
    component: Me,
  },
  {
    path: "/messages",
    component: Messages,
    exact: true,
  },
  {
    path: "/messages/:id",
    component: MsgRoom,
  },
  {
    path: "/users/:id",
    component: UserProfile,
    exact: true,
  },
  {
    path: "/users/:id/edit-profile",
    component: EditProfile,
  },
  {
    path: "/category/:slug",
    component: Category,
  },
  {
    path: "/product/new",
    component: CreateProduct,
  },
  {
    path: "/product/:id",
    component: Product,
    exact: true,
  },
  {
    path: "/product/:id/edit",
    component: EditProduct,
  },
];

export const LoggedInRouter = () => {
  const { pathname } = useLocation();
  const { data: receiveMsgCountData } = useSubscription<receiveMsgCount>(
    RECEIVE_MSG_COUNT
  );
  const _newMsgManager = useReactiveVar(newMsgManager);

  useEffect(() => {
    if (receiveMsgCountData?.receiveMsgCount) {
      const {
        receiveMsgCount: { msgCounts, id: msgRoomId },
      } = receiveMsgCountData;

      if (pathname === `/messages/${msgRoomId}`) {
        return;
      }

      const findOne = _newMsgManager.find((each) => each.id === msgRoomId);
      if (findOne) {
        const filtered = _newMsgManager.filter((each) => each.id !== msgRoomId);
        newMsgManager([
          ...filtered,
          { ...findOne, newMsg: msgCounts - findOne.prevMsg },
        ]);
      } else {
        newMsgManager([
          ..._newMsgManager,
          { id: msgRoomId, prevMsg: msgCounts - 1, newMsg: 1 },
        ]);
      }
    }
  }, [receiveMsgCountData]);

  return (
    <Switch>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          component={route.component}
          exact={route.exact}
        />
      ))}
      <Route>
        <Redirect to={"/"} />
      </Route>
    </Switch>
  );
};
