const React = require('react'),
  ReactDOM = require('react-dom'),
  Router = require('director').Router,
  Store = require('./store.jsx'),
  Actions = require('./actions.jsx');

/* global moment */

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
          <button onClick={ this.prevMonth.bind(this) }>&lt;</button>
          { year }年 { month+1 }月
          <button onClick={ this.nextMonth.bind(this) }>&gt;</button>
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
class DayItem extends React.Component {
  render() {
    const { currentDate, year, month, dayNum, isPast, items } = this.props;
    const startDay = moment(currentDate).startOf('month').weekday();
    const date = moment({ year: year, month: month, day: (dayNum - startDay + 1) });

    const filteredItems = items.filter(function(item){
      return moment(item.date, 'YYYY/MM/DD').isSame(date);
    }).map(function(item) {
      return <li key={ item.id }>{item.time} { item.text }</li>
    });

    if (isPast){
      return (<div className={'past day ' + dayNames[ dayNum % 7 ]}>&nbsp;</div>);
    } else {
      const isToday = moment().isSame(date, 'day');
      const dayClass = isToday ? " today" : "";
      return (
        <div className={'day ' + dayNames[ dayNum % 7 ] + dayClass}>
          { dayNum - startDay +1 }
          <div className='items'>{ filteredItems }</div>
        </div>);
    }
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
    const {currentDate, items} = this.state;
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();

    return (
      <section>
        <CalendarHeader year={ year } month={ month }></CalendarHeader>
        <DayHeader></DayHeader>
        <DayItems currentDate={ currentDate } year={ year } month={ month } items={ items }></DayItems>
      </section>
    );
  }

  _onChange() {
    this.setState(Store.getState());
  }
}


/* ================================================== */
//Define routes.
var router = Router({
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
