import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import { AppBar, Toolbar, Typography } from '@material-ui/core';

import { DrawdownPage } from './pages/drawdown';
import HomePage from './pages/homepage';

const NavItem = (props: { children: React.ReactChild, to: string }) => {
  return (
    <Link to={props.to} style={{ textDecoration: 'none', color: 'white', marginLeft: '20px' }}>
      <Typography variant="button">
        {props.children}
      </Typography>
    </Link>
  );
}

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Nick FI
          </Typography>
          <NavItem to="/">Home</NavItem>
          <NavItem to="/drawdown">Drawdown</NavItem>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/drawdown">
          <DrawdownPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
