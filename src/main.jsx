import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import FromToDestination from "./FromToDestination";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/from-to-destination",
    element: <FromToDestination />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <RouterProvider router={router} />
    {/* </Provider> */}
  </React.StrictMode>
);
