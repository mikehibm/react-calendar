/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import DayItem from './DayItem.jsx';

class DayItems extends React.Component {
  render() {
    const { currentDate, year, month, items } = this.props;
    const startDate = moment(currentDate).startOf('month');
    const endDate = moment(currentDate).endOf('month');
    const displayStartDate = moment(startDate).startOf('week');
    const displayEndDate = moment(endDate).endOf('week');
    
    const days = [];
    let d = moment(displayStartDate), i = 0, isBefore = false, isAfter = false;
    while (d.isSameOrBefore(displayEndDate)){
      isBefore = d.isBefore(startDate);
      isAfter = d.isAfter(endDate);
      let filteredItems = items.filter((item) => {
        return item.date == d.format('YYYY/MM/DD');
      });
      console.log("d=", d.format('YYYY/MM/DD'), ", isBefore=", isBefore, ", isAfter=", isAfter, 
                  ", startDate=", startDate.format('YYYY/MM/DD'), 
                  ", endDate=", endDate.format('YYYY/MM/DD'));

      days.push(<DayItem key={i} index={i} 
                  currentDate={currentDate} 
                  year={ year } month={ month } date={moment(d)} 
                  isBefore={ isBefore } isAfter={ isAfter } 
                  items={ filteredItems }>
                </DayItem>);

      d = moment(d).add(1, 'days');
      i++;
    }

    return (<div className='days'>{ days }</div>);
  }
}

module.exports = DayItems;