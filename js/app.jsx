const React = require('react'),
  ReactDOM = require('react-dom'),
  Router = require('director').Router,
  Store = require('./store.jsx'),
  Actions = require('./actions.jsx');

/* global moment */

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


class CalendarHeader extends React.Component {
  prevMonth() {
    Actions.prevMonth();
  }
  nextMonth() {
    Actions.nextMonth();
  }

  render() {
    const { year, month } = this.props;

    return <header>
          <button onClick={ this.prevMonth.bind(this) }>&lt;</button>
          { year }年 { month }月
          <button onClick={ this.nextMonth.bind(this) }>&gt;</button>
        </header>;
  }
}

class DayHeader extends React.Component {
  render(){
    const dayHeader = [];    

    dayNames.forEach(function(item, index) {
      dayHeader.push(<div key={ index }>{ item }</div>);
    });
    
    return <div className='dayHeader'>
      { dayHeader }
    </div>;
  }
}

class App extends React.Component{
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
    const currentDate = this.state.currentDate;
    const year = moment(currentDate).year();
    const month = moment(currentDate).month() + 1;
    const dayOfMonth = moment(currentDate).date();
    const startOfMonth = moment(currentDate).startOf('month');
    const startDay = startOfMonth.weekday();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={i} className={'past day ' + dayNames[ i % 7 ]}>&nbsp;</div>);
    }

    for (let i = 0 + startDay; i < 31 + startDay; i++) {
      let isToday = moment().isSame(moment({
        year: year,
        month: month - 1,
        day: (i - startDay + 1)
      }), 'day');
      let dayClass = isToday ? " today" : "";
      days.push(<div key={i} className={'day ' + dayNames[ i % 7 ] + dayClass}>{ i - startDay +1 }</div>);
    }

    let items = this.state.items.map(function(item) {
      return <li key={ item.id }>{ item.text }</li>
    });
    return (
      <section>
        <CalendarHeader year={ year } month={ month }></CalendarHeader>
        
        <DayHeader></DayHeader>

        <div className='days'>
          { days }
        </div>
        
        <div className='items'>
          { items }
        </div>
      </section>
    );
  }

  _onChange() {
    this.setState(Store.getState());
  }
}


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
