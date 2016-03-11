/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import DayHeader from './DayHeader.jsx';
import DayItem from './DayItem.jsx';

class DayItems extends React.Component {
  render() {
    const { currentDate, year, month, items } = this.props;
    const startDate = moment(currentDate).startOf('month');
    const endDate = moment(currentDate).endOf('month');
    const displayStartDate = moment(startDate).startOf('week');
    const displayEndDate = moment(endDate).endOf('week');
    
    const weeks = [];
    let days = [];
    let d = moment(displayStartDate), i = 0;
    while (d.isSameOrBefore(displayEndDate)){
      
      const isBefore = d.isBefore(startDate);
      const isAfter = d.isAfter(endDate);
      
      const filteredItems = items.filter((item) => {
        return item.date == d.format('YYYY/MM/DD');
      });
      filteredItems.sort((a, b) => a.time > b.time);
      
      days.push(
        <DayItem key={i} index={i} 
          currentDate={currentDate} 
          year={ year } month={ month } date={moment(d)} 
          isBefore={ isBefore } isAfter={ isAfter } 
          items={ filteredItems }>
        </DayItem>);

      if (i % 7 == 6){
        weeks.push(<tr key={i}>{ days }</tr>);
        days = [];
      }
      
      d = moment(d).add(1, 'days');
      i++;
    }

    return (
      <table className='days'>
        <thead>
          <DayHeader></DayHeader>
        </thead>
        <tbody>
          { weeks }
        </tbody>
      </table>);
  }
}

module.exports = DayItems;