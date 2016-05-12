/* global moment */
import React from 'react';
import Constants from '../constants.jsx';
import Actions from '../actions.jsx';
import RaisedButton from 'material-ui/lib/raised-button';
import GoogleApiLoader from '../GoogleApiLoader.jsx';
    
class CalendarHeader extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  componentDidMount(){
    console.log('CalendarHeader.componentDidMount.');          

    setTimeout(() => {
      GoogleApiLoader.renderSignInButton('my-signin2', {'width': 110 });
    }, 1000);
    
    GoogleApiLoader.authLoaded(() => {
        console.log('GoogleApiLoader.authLoaded.');  
        const auth2 = GoogleApiLoader.getAuth2();
        
        
        auth2.currentUser.listen((user) => {
          console.log('GoogleApiLoader.currentUser changed.', user);          

          const isLoggedIn = auth2.isSignedIn.get();
          this.setState({ isLoggedIn });
          if (isLoggedIn) {
              const profile = user.getBasicProfile();
              console.log('user profile=', profile);
              const userProfile = {};
              userProfile.id = profile.getId();
              userProfile.name = profile.getName();
              userProfile.thumb = profile.getImageUrl();
              userProfile.email = profile.getEmail();
              
              this.setState({ loggedInUser: userProfile });
      	      this.getGoogleEvents(userProfile.email);
          } else {
              this.setState({ loggedInUser: null });
      	      this.clearGoogleEvents();
          }
        });
    });

    GoogleApiLoader.clientsLoaded(() => {
        this.setState({clientsLoaded: true});
        
        console.log('GoogleApiLoader.clientsLoaded.');
        const user = this.state.loggedInUser;
        if (user){
	        this.getGoogleEvents(user.email);
        }
    });
  }
  
  handleSignOut(){
    GoogleApiLoader.signOut().then(() => {
      console.log('Signed out.');
    });
  }
  
  clearGoogleEvents(){
    console.log('clearGoogleEvents');
  }
  
	getGoogleEvents(calendar_id) {
    console.log('getGoogleEvents email='+ calendar_id, this.state.isLoggedIn, this.state.clientsLoaded);	   
    
    if (!calendar_id || !this.state.isLoggedIn || !this.state.clientsLoaded)
      return;
    
    const request = gapi.client.calendar.events.list({
      'calendarId': calendar_id, //'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 30,
      'orderBy': 'startTime'
    });
    
    request.execute(function(resp) {
      console.log('getGoogleEvents response', resp);
      if (resp.error){
        const msg = resp.error.message;
        alert('Cannot access calendar info. Please sign in again.\n\n' + msg);
        GoogleApiLoader.signOut();
        return;
      }
      const events = resp.items;
      console.log('Upcoming events:');

      if (events.length == 0) {
        console.log('No upcoming events found.');
        return;
      }
      for (var i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          console.log(event.summary + ' (' + when + ')')
      }
    });
	}
	
  prevMonth() {
    Actions.prevMonth();
  }
  nextMonth() {
    Actions.nextMonth();
  }

  render() {
    const { year, month } = this.props;
    const { isLoggedIn } = this.state;
    const signInButtonClass = 'my-signin2 ' + (isLoggedIn ? "hidden" : "shown");

    return (
      <header>
          <RaisedButton label="&lt;" onClick={ this.prevMonth.bind(this) } />
          <div className="year_month">
            { year }年 { month+1 }月
          </div>
          <RaisedButton label="&gt;" onClick={ this.nextMonth.bind(this) } />
          
          <div id="my-signin2" className={ signInButtonClass } >Sign In</div>
          { isLoggedIn ? <RaisedButton label="Sign Out" className='my-signout' onClick={ this.handleSignOut.bind(this) } /> : null }
          
      </header>);
  }
}

module.exports = CalendarHeader;