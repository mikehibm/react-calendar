/* global moment */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'director';
import Constants from './constants.jsx';
import Store from './store.jsx';
import Actions from './actions.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import DayHeader from './components/DayHeader.jsx';
import CalendarItem from './components/CalendarItem.jsx';
import DayItem from './components/DayItem.jsx';
import DayItems from './components/DayItems.jsx';
import CalendarItemDialog from './components/CalendarItemDialog.jsx';

/////////////////////////////////
// For Material UI
//Needed for onTouchTap. Can go away when react 1.0 release 
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
/////////////////////////////////


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = Store.getState();
  }

  componentDidMount() {
    Store.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    Store.removeChangeListener(this._onChange.bind(this));
  }

  render() {
    const {currentDate, items, selectedDate, isDialogOpen} = this.state;
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();

    return (
      <section>
        <CalendarHeader year={ year } month={ month }></CalendarHeader>
        <DayHeader></DayHeader>
        <DayItems currentDate={ currentDate } year={ year } month={ month } items={ items }></DayItems>
        <CalendarItemDialog selectedDate={ selectedDate } isDialogOpen={ isDialogOpen } />
      </section>
    );
  }

  _onChange() {
    this.setState(Store.getState());
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
