import "tailwindcss/dist/tailwind.min.css";

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import routes from "./routes";
import { FirebaseConfigProvider } from "./hooks/useFirebaseConfig";

export default function App() {
  return (
    <Router>
      {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
      <Switch>
        <FirebaseConfigProvider projectId={"codesandbox-config"}>
          {routes.map(({ path, Component }) => (
            <Route exact path={path} key={path}>
              <Component />
            </Route>
          ))}
        </FirebaseConfigProvider>
      </Switch>
    </Router>
  );
}
