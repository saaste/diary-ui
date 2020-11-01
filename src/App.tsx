import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route, Switch
} from "react-router-dom";
import { getTokenFromStorage } from './utils/auth';
import Entries from "./views/Entries";
import Login from "./views/Login";
import NotFound from "./views/NotFound"
import "./App.css"


export interface RootState {
  isLoggedIn: boolean;
  token: string;
}

export type UpdateStateFunc = (updatedState: Partial<RootState>) => void;

const App = () => {
  const [state, setState] = useState<RootState>({
    isLoggedIn: getTokenFromStorage() !== null,
    token: getTokenFromStorage() || ""
  })

  const updateState: UpdateStateFunc = (updatedState: Partial<RootState>) => {
    setState({ ...state, ...updatedState })
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Login updateState={updateState} />
        </Route>
        <Route exact path="/">
          {state.isLoggedIn ? <Entries rootState={state} updateState={updateState} /> : <Redirect to="/login" />}
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
