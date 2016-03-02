/* global moment */
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
    const { date, index, year, month, isBefore, isAfter, items } = this.props;
    const isToday = moment().isSame(date, 'day');
    const dayName = Constants.dayNames[ index % 7 ];
    const dayClass = 'day items ' + dayName 
                      + (isToday ? ' today' : '')
                      + (isBefore || isAfter ? ' past' : '');
    
    const calendarItems = items.map((item) => {
      return <CalendarItem key={item.id} item={ item } />;
    });

    return (
      <div className={ dayClass } onClick={ this.handleClick.bind(this, date.toDate())  }>
        { date.format('D') }
        <ul>{ calendarItems }</ul>
      </div>);
  }
  
}

module.exports = DayItem;