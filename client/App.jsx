import React, { Component, Image, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import UriEntry from './Components/UriEntry.jsx';
import theme from './theme';
import { ThemeProvider } from '@material-ui/core';
import CodeOutput from './Components/CodeOutput.jsx';
import CodeOutputButtons from './Components/CodeOutputButtons.jsx';
import Diagram from './Components/Diagram.jsx';
import Docs from './Components/Docs.jsx';
import Team from './Components/Team.jsx';

// | App (contains navbar)
//   |URI Entry
//   |Codebox
//   |Diagram

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      database: {
        allTables: {},

        foreignKeys: [],
        primaryKeys: [],
        completeSchemaString: ' ',
        resolvers: ' '
      },
      renderSchema: true,
    };
    this.gTD = this.gTD.bind(this);
    this.changeRender = this.changeRender.bind(this);
  }

  gTD() {
    axios
      .post('/api/uri', {
        uri:
          document.getElementById('filled-basic').value ||
          'postgres://vdnvhfkq:sYiMTdCmk1vs2br_eUrrmX1unPvfucdW@batyr.db.elephantsql.com/vdnvhfkq',
      })
      .then((response) => {
        // handle success
        document.getElementById('filled-basic').value = '';
        this.setState(state => {
          return {...state, database: response.data }
        });
        document.getElementById('outlined-multiline-static').value = this.state.database.completeSchemaString;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  changeRender(schema) {
    if (schema === false) {
      this.setState(state => {
        return {...state, renderSchema: false}
      })
      document.getElementById('outlined-multiline-static').value = this.state.database.resolvers;
    } else {
      this.setState(state => {
        return {...state, renderSchema: true}
      })
      document.getElementById('outlined-multiline-static').value = this.state.database.completeSchemaString;
    }
    

  }

  render() {
    return (
      <Router>
        <div className="header">
          <Link to="/">
            <img id="logo" src="./assets/logo.png" />
          </Link>
          <div className="topButtons">
            {/* <Link to="/signup">
              <button
                className="signup-btn"
                // onClick={(event) => {
                //   console.log('trying to send you to singup');
                //   console.log(this.state);
                //   this.setState({ currentpage: 'signup' });}}
              >
                {' '}
                Sandbox{' '}
              </button>
            </Link> */}

            <Link to="/docs">
              <button className="login-btn"> Docs </button>
            </Link>

            <a href="https://github.com/oslabs-beta/beam-corp" target="_blank" rel="noreferrer">
              <button>Github</button>
            </a>
            <Link to="/team">
              <button>Team</button>
            </Link>
          </div>
          <ThemeProvider theme={theme}>
            <UriEntry gTD={this.gTD} />
          </ThemeProvider>
        </div>

        <Switch>
          <Route exact path="/">
            <img id="gif" src="./assets/getstarted.gif" alt="Get Started" />
            {/* <h1 id="gifheader">Getting Started</h1> */}
          </Route>
          <Route exact path="/docs">
            <Docs />
            <img
              id="gif"
              style={{ marginRight: '30px', width: '50vw' }}
              src="./assets/getstarted.gif"
              alt="Get Started"
            />
          </Route>
          <Route path="/visualize">
            <div id="OutputBox">
              <Diagram id="outputRight" data={this.state.database} />
              <div id="outputLeft">
                <CodeOutputButtons database={this.state.database} renderSchema={this.state.renderSchema} changeRender={this.changeRender} />
                <CodeOutput database={this.state.database} renderSchema={this.state.renderSchema} />
              </div>
            </div>
          </Route>
          <Route exact path="/team">
            <Team />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
