import React from "react";
import ReactDom from "react-dom";
import App from "./components/app";
import * as serviceWorker from "./serviceWorker";

serviceWorker.unregister();

ReactDom.render(<App />, document.getElementById("root"));