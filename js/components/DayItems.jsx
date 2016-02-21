/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import DayItem from './DayItem.jsx';

class DayItems extends React.Component {
  render() {
    const { currentDate, year, month, items } = this.props;
    const startDay = moment(currentDate).startOf('month').weekday();
    const days = [];
    const endDate = moment(currentDate).endOf('month').date();

    for (let i = 0; i < startDay; i++) {
      days.push(<DayItem key={i}currentDate={currentDate} year={ year } month={ month }
                  isPast={ true } dayNum={i} items={ items }></DayItem>);
    }

    for (let i = 0 + startDay; i < endDate + startDay; i++) {
      days.push(<DayItem key={i} currentDate={currentDate} year={ year } month={ month }
                  isPast={ false } dayNum={i} items={ items }></DayItem>);
    }

    return (<div className='days'>{ days }</div>);
  }
}

module.exports = DayItems;