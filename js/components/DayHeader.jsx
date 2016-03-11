import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';

class DayHeader extends React.Component {
  render() {
    return (
      <tr className='dayHeader'>
        { Constants.dayNames.map((item, index) => {
          return <td key={ index }>{ item }</td>;
        }) }
      </tr>);
  }
}

module.exports = DayHeader;