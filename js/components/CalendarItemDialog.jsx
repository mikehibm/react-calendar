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

   constructor(props) {
    super(props);
    
    this.state = { 
      isRemoveDialogOpen: false 
    };
  }

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
      const msg = Actions.addItem(date, time, text);
      if (msg){
        alert(msg);
        return;
      }
    }
    
    this.handleClose();
  }
  
  handleClose(){
    Actions.closeItem();
  }
  
  openRemoveDialog(){
    const { selectedItem } = this.props;
    console.log("openRemoveDialog");
    const id = selectedItem.id;
    const date = selectedItem.date;
    const time = selectedItem.time;
    const text = selectedItem.text;
    console.log(`${date} ${time} ${text}`);
    this.setState({isRemoveDialogOpen : true });
  }

  closeRemoveDialog(){
    this.setState({isRemoveDialogOpen : false});
  }
  
  handleRemoveOk(){
    const { selectedItem } = this.props;
    console.log("handleRemoveOk");
    const id = selectedItem.id;
    Actions.removeItem(id);
    this.closeRemoveDialog();
    this.handleClose();
  }

  render(){
    const { selectedDate, selectedItem, isDialogOpen } = this.props;
    const actions = [
      <FlatButton label="Cancel" secondary={true} onTouchTap={this.handleClose.bind(this)} />,
      <FlatButton label="Ok" primary={true} keyboardFocused={true} onTouchTap={this.handleCloseOK.bind(this)} />,
    ];    
    const is_new = !(selectedItem && selectedItem.id);
    const title = is_new ? '新しい予定' : '予定の編集';
    const time = selectedItem && moment(selectedItem.date + ' ' + selectedItem.time, 'YYYY/MM/DD HH:mm').toDate();

    const remveDialogActions = [
      <FlatButton label="Cancel" secondary={true} onTouchTap={this.closeRemoveDialog.bind(this)} />,
      <FlatButton label="Remove" primary={true} keyboardFocused={true} onTouchTap={this.handleRemoveOk.bind(this)} />,
    ];    

    return (
      <Dialog
          title={ title }
          actions={ actions } modal={ false } open={ isDialogOpen }
          onRequestClose={this.handleClose.bind(this)}
        >
          <div className="row">
            <DatePicker ref="date" autoOk={true} defaultDate={ selectedDate } />
            <TimePicker ref="time" autoOk={false} defaultTime={ time } />
          </div>
          <TextField ref="text" defaultValue={ selectedItem.text } />
          
          {is_new ? null :
            <FlatButton label="DELETE" primary={false} keyboardFocused={false} 
                onTouchTap={this.openRemoveDialog.bind(this)} />
          }
          
          <Dialog
            title="Are you sure to remove this item?"
            actions={remveDialogActions}
            modal={false}
            open={this.state.isRemoveDialogOpen}
            onRequestClose={this.closeRemoveDialog}
          >
            { selectedItem.date } { selectedItem.time }<br />{ selectedItem.text }
          </Dialog>          
      </Dialog>);
  }
}

module.exports = CalendarItemDialog;