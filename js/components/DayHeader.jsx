import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';

class DayHeader extends React.Component {
  render() {
    return (
      <div className='dayHeader'>
        { Constants.dayNames.map((item, index) => {
          return <div key={ index }>{ item }</div>;
        }) }
      </div>);
  }
}

module.exports = DayHeader;