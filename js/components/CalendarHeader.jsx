/* global moment, gapi */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import GoogleApiLoader from '../GoogleApiLoader.jsx';
    
class CalendarHeader extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    console.log('CalendarHeader.componentDidMount.');          

    GoogleApiLoader.renderSignInButton('my-signin2', {'width': 110 });
  }
  
  handleSignOut(){
    GoogleApiLoader.signOut();
  }
  
  prevMonth() {
    Actions.prevMonth();
  }
  nextMonth() {
    Actions.nextMonth();
  }

  render() {
    const { year, month, isLoggedIn } = this.props;
    const signInButtonClass = 'my-signin2 ' + (isLoggedIn ? 'hidden' : 'shown');
    const signOutButtonClass = 'my-signout ' + (isLoggedIn ? 'shown' : 'hidden');

    return (
      <header>
          <RaisedButton label="&lt;" onClick={ this.prevMonth.bind(this) } />
          <div className="year_month">
            { year }年 { month+1 }月
          </div>
          <RaisedButton label="&gt;" onClick={ this.nextMonth.bind(this) } />
          
          <div id="my-signin2" className={ signInButtonClass } >Sign In</div>
          <div className={ signOutButtonClass }><RaisedButton label="Sign Out" onClick={ this.handleSignOut.bind(this) } /></div>

      </header>);
  }
}

module.exports = CalendarHeader;