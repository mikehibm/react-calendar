/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import CalendarItem from './CalendarItem.jsx';

class DayItem extends React.Component {
  constructor(props) {
    super(props);
  }  
  
  handleClick(){
    const { date } = this.props;
    const selectedDate = date.toDate();
    console.log('DayItem clicked selectedDate=', selectedDate);
    Actions.openItem(selectedDate, null);
  }
  
  render() {
    const { date, index, year, month, isBefore, isAfter, items } = this.props;
    const isToday = moment().isSame(date, 'day');
    const dayIndex = index % 7;
    const dayName = Constants.dayNames[ dayIndex ];
    const dayClass = 'day ' + dayName 
                      + (isToday ? ' today' : '')
                      + (isBefore || isAfter ? ' past' : '');
    
    const calendarItems = items.map((item) => {
      return <CalendarItem key={item.id} item={ item } />;
    });

    return (
      <td className={ dayClass } onClick={ this.handleClick.bind(this) }>
        { date.format('D') }
        <ul className="items">{ calendarItems }</ul>
      </td>);
  }
  
}

module.exports = DayItem;