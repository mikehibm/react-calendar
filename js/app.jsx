/* global moment, gapi */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'director';
import Constants from './constants.jsx';
import Store from './store.jsx';
import Actions from './actions.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import DayItems from './components/DayItems.jsx';
import CalendarItemDialog from './components/CalendarItemDialog.jsx';
import GoogleApiLoader from './GoogleApiLoader.jsx';

/////////////////////////////////
// For Material UI
//Needed for onTouchTap. Can go away when react 1.0 release 
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
/////////////////////////////////


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = Store.getState();
  }

  componentDidMount() {
    Store.addChangeListener(this._onChange.bind(this));
    console.log('App.componentDidMount.');          
    
    GoogleApiLoader.authLoaded(() => {
        this.setState({authLoaded: true});
        console.log('GoogleApiLoader.authLoaded.');  
        const auth2 = GoogleApiLoader.getAuth2();
        
        setTimeout(() => {
          gapi.signin2.render('my-signin2', {
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'width': 120,
            'height': 40,
            //'longtitle': true,
            //'theme': 'dark'
          });  
        }, 100);
        
        auth2.currentUser.listen((user) => {
          console.log('GoogleApiLoader.currentUser changed.', user);          
          this.setState({finishedLoading: true});

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
  
  componentWillUnmount() {
    Store.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState(Store.getState());
  }
  
  handleSignOut(){
    GoogleApiLoader.signOut(() => this.setState());
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
	
  render() {
    const {currentDate, items, selectedDate, selectedItem, isDialogOpen, isLoggedIn} = this.state;
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();
    const signInButtonClass = "my-signin2 " + (isLoggedIn ? "hidden" : "shown");

    return (
      <section>
        <div id="my-signin2" className={ signInButtonClass } >Sign In</div>
        { isLoggedIn ? <a onClick={ this.handleSignOut.bind(this) }>Sign Out</a> : null }
        
        <CalendarHeader year={ year } month={ month }></CalendarHeader>
        <DayItems currentDate={ currentDate } year={ year } month={ month } items={ items }></DayItems>
        <CalendarItemDialog selectedDate={ selectedDate } selectedItem={ selectedItem } isDialogOpen={ isDialogOpen } />
      </section>
    );
  }

}



/* ================================================== */
const router = Router({
    '/': function() {
      Actions.showAll();
    },
    '/active': function() {
      Actions.showActive();
    },
    '/completed': function() {
      Actions.showCompleted();
    }
  })
  .configure({
    'notfound': function() {
      Actions.showAll();
    },
    'html5history': false
  })
  .init();


ReactDOM.render(
  <App />,
  document.getElementsByClassName('calenderapp')[0]
);

