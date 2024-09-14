import * as React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Registration from "./component/Registration";
import Login from "./component/Login";
import ClassCreater from "./component/ClassCreater";
import Home from "./component/Home";
import UserErollClass from "./component/UserErollClass";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (<Login/>),
  },
  {
    path: "/signup",
    element: (<Registration/>)
  },
  {
    path: "/class-creation",
    element :(<ClassCreater/>)
  },
  {
    path : "/",
    element : (<Home/>)
  },{
    path : "/user",
    element :(<UserErollClass/>)
  }
]);
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
