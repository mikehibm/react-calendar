const React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('director').Router,
      Store = require('./store.jsx'),
      Actions = require('./actions.jsx');

/* global moment */

const App = React.createClass({
  getInitialState: function() {
    return Store.getState();
  },
  
  componentDidMount: function () {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    Store.removeChangeListener(this._onChange);
  },
  
  prevMonth: function(){
    console.log('Prev Month');
    Actions.prevMonth();
  },
  nextMonth: function(){
    console.log('Next Month');
    Actions.nextMonth();
  },
  
  render: function() {
    const currentDate = this.state.currentDate;
    const year = moment(currentDate).year();
    const month = moment(currentDate).month() + 1;
    const dayOfMonth = moment(currentDate).date();
    const startOfMonth = moment(currentDate).startOf('month');
    const startDay = startOfMonth.weekday();
    console.log('startDay=' + startDay);
    
    const days = [], dayHeader = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    dayNames.forEach(function(item, index){
      dayHeader.push(<div key={ index }>{ item }</div>);
    });
    
    for (let i = 0; i < startDay; i++){
      days.push(<div key={i} className={'past day ' + dayNames[ i % 7 ]}>&nbsp;</div>);
    }
    
    for (let i = 0 + startDay; i < 31 + startDay; i++){
      let isToday = moment().isSame(moment({year: year, month: month-1, day: (i - startDay+1)}), 'day');
      let dayClass = isToday ? " today" : "";
      days.push(<div key={i} className={'day ' + dayNames[ i % 7 ] + dayClass}>{ i - startDay +1 }</div>);
    }
    
    let items = this.state.items.map(function(item){
      return <li key={ item.id }>{ item.text }</li>
    });
    return (
      <section>
        <header>
          <button onClick={ this.prevMonth }>&lt;</button>
          { year}年 { month }月
          <button onClick={ this.nextMonth }>&gt;</button>
        </header>
        
        <div className='dayHeader'>
          { dayHeader }
        </div>
        
        <div className='days'>
          { days }
        </div>
        
        <div className='items'>
          { items }
        </div>
      </section>
    );
  },
  
  _onChange: function () {
    this.setState(Store.getState());
  }  
});


//Define routes.
var router = Router({
  '/': function(){ Actions.showAll(); },
  '/active': function(){ Actions.showActive(); },
  '/completed': function(){ Actions.showCompleted(); }
})
.configure({
  'notfound': function(){ Actions.showAll(); },
  'html5history': false
})
.init();


ReactDOM.render(
  <App />,
  document.getElementsByClassName('calenderapp')[0]
);
