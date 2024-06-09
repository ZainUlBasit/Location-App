import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import FromToDestination from "./FromToDestination";
import Directions from "./Directions";
import Routes from "./Routes";
import Places from "./Places";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/directions",
    element: <Directions />,
  },
  {
    path: "/routes",
    element: <Routes />,
  },
  {
    path: "/places",
    element: <Places />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <RouterProvider router={router} />
    {/* </Provider> */}
  </React.StrictMode>
);
