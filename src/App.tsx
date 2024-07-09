import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store"; // Ensure store configuration is correct
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
