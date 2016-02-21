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
    console.log("handleCloseOK");
    const date = this.refs.date.getDate();
    const time = this.refs.time.getTime();
    const text = this.refs.text.getValue();
    console.log("date = ", date, ", time = ", time, ", text = '" + text + "'");
    Actions.addItem(date, time, text);
    
    this.handleClose();
  }
  
  handleClose(){
    Actions.closeItem();
  }

  render(){
    const selectedDate = this.props.selectedDate;
    const open = this.props.isDialogOpen;
    const actions = [
      <FlatButton label="Ok" primary={true} keyboardFocused={true} onTouchTap={this.handleCloseOK.bind(this)} />,
    ];    

    return (
      <Dialog
          title="新しい予定"
          actions={actions} modal={false} open={open}
          onRequestClose={this.handleClose.bind(this)}
        >
          <div className="row">
            <DatePicker ref="date" hintText="Date" autoOk={true} defaultDate={ selectedDate } />
            <TimePicker ref="time" hintText="Time" autoOk={false} />
          </div>
          <TextField ref="text" hintText="新しい予定"  defaultValue="新しい予定です。" />
      </Dialog>);
  }
}

module.exports = CalendarItemDialog;