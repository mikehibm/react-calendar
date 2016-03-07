/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';

class CalendarItem extends React.Component {
  
  handleClick(e){
    const item = this.props.item;
    console.log('CalendarItem clicked item=', item, e);
    e.stopPropagation();
    const selectedDate = moment(item.date, 'YYYY/MM/DD').toDate();
    Actions.openItem(selectedDate, item);
  }
  
  render() {
      const item = this.props.item;
      return (<li key={ item.id } onClick={ this.handleClick.bind(this) }>
        {item.time} { item.text }
      </li>);
  }
}

module.exports = CalendarItem;