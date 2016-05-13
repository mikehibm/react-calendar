/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';


class CalendarItemDialog extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = { 
      isRemoveDialogOpen: false 
    };
  }
  
  componentWillReceiveProps(nextProps){
    const { selectedItem } = nextProps;
    const { date: strDate, time: strTime, text} = selectedItem;
    const date = moment(strDate, 'YYYY/MM/DD').toDate();
    const time = moment(strTime || '00:00', 'HH:mm').toDate();
    this.setState({ 
      date,
      time,
      text
    });
  }

  

  handleCloseOK(){
    const { selectedDate, selectedItem } = this.props;
    console.log("handleCloseOK");
    const id = selectedItem.id;
    const {date, time, text} = this.state;
    console.log(`date=${date}, time=${time}, text=${text}`);

    var msg = id ? Actions.updateItem(id, date, time, text)
                 : Actions.addItem(date, time, text);
    if (msg){
      alert(msg);
      return;
    }
    
    this.handleClose();
  }
  
  handleClose(){
    Actions.closeItem();
  }
  
  openRemoveDialog(){
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

  handleChangeDate(event, date){
    this.setState({ date });
  }

  handleChangeTime(event, time){
    this.setState({ time });
  }

  handleChangeText(event, text){
    this.setState({ text });
  }
  
  render(){
    const { selectedDate, selectedItem, isDialogOpen } = this.props;
    const actions = [
      <FlatButton label="Cancel" secondary={true} onTouchTap={this.handleClose.bind(this)} />,
      <FlatButton label="Ok" primary={true} keyboardFocused={true} onTouchTap={this.handleCloseOK.bind(this)} />,
    ];    
    const is_new = !(selectedItem && selectedItem.id);
    const title = is_new ? '新しい予定' : '予定の編集';

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
            <DatePicker id="date" autoOk={true} value={ this.state.date } onChange={ this.handleChangeDate.bind(this) } />
            <TimePicker id="time" autoOk={false} value={ this.state.time } onChange={ this.handleChangeTime.bind(this) } />
            <TextField id="text" value={ this.state.text } onChange={ this.handleChangeText.bind(this) } />
          </div>
          
          { is_new ? null :
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