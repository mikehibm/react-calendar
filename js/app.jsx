/* global moment */

//import React from 'react';
const React = require('react'),
  ReactDOM = require('react-dom'),
  Router = require('director').Router,
  Store = require('./store.jsx'),
  Actions = require('./actions.jsx');

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import TextField from 'material-ui/lib/text-field';


 /* ================================================== */
// For Material UI
import injectTapEventPlugin from 'react-tap-event-plugin';
 
//Needed for onTouchTap. Can go away when react 1.0 release 
injectTapEventPlugin();



const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ================================================== */
class CalendarHeader extends React.Component {
  prevMonth() {
    Actions.prevMonth();
  }
  nextMonth() {
    Actions.nextMonth();
  }

  render() {
    const { year, month } = this.props;

    return (
      <header>
          <RaisedButton label="&lt;" onClick={ this.prevMonth.bind(this) } />
          <div className="year_month">
            { year }年 { month+1 }月
          </div>
          <RaisedButton label="&gt;" onClick={ this.nextMonth.bind(this) } />
      </header>);
  }
}

/* ================================================== */
class DayHeader extends React.Component {
  render() {
    const dayHeaders = dayNames.map(function(item, index){
      return <div key={ index }>{ item }</div>;
    });

    return (
      <div className='dayHeader'>
        { dayHeaders }
      </div>);
  }
}

/* ================================================== */
class CalendarItem extends React.Component {
  render() {
      const item = this.props.item;
      return <li key={ item.id }>{item.time} { item.text }</li>;
  }
}

/* ================================================== */
class DayItem extends React.Component {
  constructor(props) {
    super(props);
  }  
  
  handleClick(date){
    console.log('DayItem clicked');
    Actions.showItem(date, 'dummy');
  }
  
  render() {
    const { currentDate, year, month, dayNum, isPast, items } = this.props;
    const startDay = moment(currentDate).startOf('month').weekday();
    const date = moment({ year: year, month: month, day: (dayNum - startDay + 1) });
    const isToday = moment().isSame(date, 'day');
    const dayName = dayNames[ dayNum % 7 ];
    const dayClass = 'day items ' + dayName + ' ' + (isToday ? 'today' : '');

    const filteredItems = items.filter(function(item){
      return moment(item.date, 'YYYY/MM/DD').isSame(date);
    }).map(function(item) {
      return <CalendarItem key={item.id} item={ item } />;
    });
    
    if (isPast){
      return (
        <div className={ 'past ' + dayClass }>&nbsp;<br />
          <ul>{ filteredItems }</ul>
        </div>);
    } 
    
    return (
      <div className={dayClass} onClick={ this.handleClick.bind(this, date.toDate())  }>
        { date.format('D') }
        <ul>{ filteredItems }</ul>
      </div>);
  }
  
}

/* ================================================== */
class CalendarItemDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: this.props.isDialogOpen,
      selectedDate: this.props.selectedDate
    };
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({
      open: nextProps.isDialogOpen,
      selectedDate: nextProps.selectedDate
    });
  }
  
  handleCloseOK(){
    alert("OK!");
    this.handleClose();
  }
  
  handleClose(){
    this.setState({open: false});
  }

  render(){
    const selectedDate = this.state.selectedDate;
    const open = this.state.open;
    const actions = [
      <FlatButton label="Ok" primary={true} keyboardFocused={true} onTouchTap={this.handleCloseOK.bind(this)} />,
    ];    

    return (
      <Dialog
          title="新しい予定"
          actions={actions} modal={false} open={open}
          onRequestClose={this.handleClose.bind(this)}
        >
          <div className="row">
            <DatePicker hintText="Date" autoOk={true} defaultDate={ selectedDate } />
            <TimePicker hintText="Time" autoOk={false} />
          </div>
          <TextField hintText="新しい予定"  defaultValue="新しい予定です。" />
      </Dialog>);
  }
}

/* ================================================== */
class DayItems extends React.Component {
  render() {
    const { currentDate, year, month, items } = this.props;
    const startDay = moment(currentDate).startOf('month').weekday();
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<DayItem key={i}currentDate={currentDate} year={ year } month={ month }
                  isPast={ true } dayNum={i} items={ items }></DayItem>);
    }

    for (let i = 0 + startDay; i < 31 + startDay; i++) {
      days.push(<DayItem key={i} currentDate={currentDate} year={ year } month={ month }
                  isPast={ false } dayNum={i} items={ items }></DayItem>);
    }

    return (<div className='days'>{ days }</div>);
  }
}

/* ================================================== */
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
//Define routes.
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
