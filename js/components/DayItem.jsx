import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import CalendarItem from './CalendarItem.jsx';

class DayItem extends React.Component {
  constructor(props) {
    super(props);
  }  
  
  handleClick(date){
    console.log('DayItem clicked');
    Actions.openItem(date, '');
  }
  
  render() {
    const { currentDate, year, month, dayNum, isPast, items } = this.props;
    const startDay = moment(currentDate).startOf('month').weekday();
    const date = moment({ year: year, month: month, day: (dayNum - startDay + 1) });
    const isToday = moment().isSame(date, 'day');
    const dayName = Constants.dayNames[ dayNum % 7 ];
    const dayClass = 'day items ' + dayName + ' ' + (isToday ? 'today' : '');

    const filteredItems = items.filter(function(item){
      return moment(item.date, 'YYYY/MM/DD').isSame(date);
    }).map((item) => {
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

module.exports = DayItem;