import React from "react";
import ReactDOM from "react-dom/client";
import { Provider,useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import App from "./App.jsx";
import PrivateRoute from './components/PrivateRoute.jsx';
import "./index.css";
import HomePage from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { persistor, store } from './store/store.js';
import Layout from "./Layout.jsx";
import AddFriends from "./pages/Friend.jsx";
import ContestLists from "./pages/ContestLists.jsx";
import FriendStanding from "./pages/FriendStanding.jsx"

// const user = useSelector((state) => state.auth.email);
const RoutesWrapper = () => {
  const user = useSelector((state) => state.auth.email);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/add-friends" element={<AddFriends />} />
          <Route path="/contest-lists" element={<ContestLists />} />
          <Route path="/contest-lists/:contest-name" element={<FriendStanding />} />
        </Route>
      </Route>
    </Routes>
  );
};
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <RoutesWrapper />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
