/*jshint esversion: 10*/
import '../css/App.css';
import SignUp from './SignUpScreen';
import MainPage from './MainPage';
import UserPage from './UserPage';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/pages" exact component={MainPage} />
          <Route path="/pages/:user" component={UserPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;