import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    {/* Wrap the app with Redux Provider */}
    <Router>
      <App />
    </Router>
  </Provider>
);
