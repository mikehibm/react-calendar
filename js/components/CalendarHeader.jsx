/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';

import RaisedButton from 'material-ui/lib/raised-button';
    
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

module.exports = CalendarHeader;