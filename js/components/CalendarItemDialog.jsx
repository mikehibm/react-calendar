/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import TextField from 'material-ui/lib/text-field';


class CalendarItemDialog extends React.Component {

  handleCloseOK(){
    const { selectedDate, selectedItem } = this.props;
    console.log("handleCloseOK");
    const id = selectedItem.id;
    const date = this.refs.date.getDate();
    const time = this.refs.time.getTime();
    const text = this.refs.text.getValue();
    console.log("date = ", date, ", time = ", time, ", text = '" + text + "'");
    
    if (id){
      Actions.updateItem(id, date, time, text);
    } else {
      Actions.addItem(date, time, text);
    }
    
    this.handleClose();
  }
  
  handleClose(){
    Actions.closeItem();
  }

  render(){
    const { selectedDate, selectedItem, isDialogOpen } = this.props;
    const actions = [
      <FlatButton label="Cancel" primary={false} keyboardFocused={false} onTouchTap={this.handleClose.bind(this)} />,
      <FlatButton label="Ok" primary={true} keyboardFocused={true} onTouchTap={this.handleCloseOK.bind(this)} />,
    ];    
    const title = (selectedItem && selectedItem.id) ? '予定の編集' : '新しい予定';
    const date = selectedDate;
    const time = selectedItem && selectedItem.time;

    return (
      <Dialog
          title={ title }
          actions={ actions } modal={ false } open={ isDialogOpen }
          onRequestClose={this.handleClose.bind(this)}
        >
          <div className="row">
            <DatePicker ref="date" hintText="Date" autoOk={true} defaultDate={ date } />
            <TimePicker ref="time" hintText="Time" autoOk={false} defaultValue={ time } />
          </div>
          <TextField ref="text" defaultValue={ selectedItem.text } />
      </Dialog>);
  }
}

module.exports = CalendarItemDialog;