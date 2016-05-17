/* global moment, gapi */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'director';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import Constants from './constants.jsx';
import Store from './store.jsx';
import Actions from './actions.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import DayItems from './components/DayItems.jsx';
import CalendarItemDialog from './components/CalendarItemDialog.jsx';

/////////////////////////////////
// For Material UI
//Needed for onTouchTap. Can go away when react 1.0 release 
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
/////////////////////////////////

const myTheme = getMuiTheme(lightTheme);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = Store.getState();
  }

  componentDidMount() {
    console.log('App.componentDidMount.');          
    Store.addChangeListener(this._onChange.bind(this));
    
    Actions.initSocialLogin();
  }
  
  componentWillUnmount() {  
    Store.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {  
    this.setState(Store.getState());
  }
  
  render() {
    const {currentDate, items, selectedDate, selectedItem, isDialogOpen, isLoggedIn} = this.state;
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();

    return (
      <MuiThemeProvider muiTheme={myTheme}>
        <div>
          <CalendarHeader year={ year } month={ month } isLoggedIn={ isLoggedIn } ></CalendarHeader>
          <DayItems currentDate={ currentDate } year={ year } month={ month } items={ items }></DayItems>
          <CalendarItemDialog selectedDate={ selectedDate } selectedItem={ selectedItem } isDialogOpen={ isDialogOpen } />
        </div>
      </MuiThemeProvider>
    );
  }

}



/* ================================================== */
const router = Router({
    '/': function() {
      Actions.showAll();
    },
    '/active': function() {
      Actions.showActive();
    },
    '/completed': function() {
      Actions.showCompleted();
    }
  })
  .configure({
    'notfound': function() {
      Actions.showAll();
    },
    'html5history': false
  })
  .init();


ReactDOM.render(
  <App />,
  document.getElementsByClassName('calenderapp')[0]
);

