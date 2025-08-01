import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import App from "./App.jsx";
import PrivateRoute from './components/PrivateRoute.jsx';
import "./index.css";
import Layout from "./Layout.jsx";
import ContestLists from "./pages/ContestLists.jsx";
import AddFriends from "./pages/Friend.jsx";
import FriendStanding from "./pages/FriendStanding.jsx";
import HomePage from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { persistor, store } from './store/store.js';

// const user = useSelector((state) => state.auth.email);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          /* Protected Routes with Layout */
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/add-friends" element={<AddFriends/>} />
              <Route path="/contest-lists" element={<ContestLists/>} />
              <Route path="/contest-lists/:contest-name" element={<FriendStanding/>}/>
            </Route>
          </Route>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
