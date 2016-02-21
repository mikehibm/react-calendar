import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';

class CalendarItem extends React.Component {
  render() {
      const item = this.props.item;
      return <li key={ item.id }>{item.time} { item.text }</li>;
  }
}

module.exports = CalendarItem;