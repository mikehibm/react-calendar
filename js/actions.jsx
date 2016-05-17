/* global moment, gapi */
import Dispatcher from './dispatcher.jsx';
import Constants from './constants.jsx';
import Item from './item.jsx';
import GoogleApiLoader from './GoogleApiLoader.jsx';

const Actions = {
    
    prevMonth: function(){
        Dispatcher.dispatch({
            actionType: Constants.PREV_MONTH
        });
    },
    
    nextMonth: function(){
        Dispatcher.dispatch({
            actionType: Constants.NEXT_MONTH
        });
    },
    
    openItem: function (date, item) {
        Dispatcher.dispatch({
            actionType: Constants.OPEN_ITEM, date, item
        });
    },
    
    closeItem: function () {
        Dispatcher.dispatch({
            actionType: Constants.CLOSE_ITEM
        });
    },
    
    addItem: function (date, time, text) {
        const item = new Item('', date, time, text);
        const msg = item.valiate();
        if (msg){
            return msg;
        }
        
        Dispatcher.dispatch({
            actionType: Constants.ADD_ITEM, 
            item
        });
    },
    
    updateItem: function(id, date, time, text){
        const item = new Item(id, date, time, text);
        const msg = item.valiate();
        if (msg){
            return msg;
        }
        
        Dispatcher.dispatch({
            actionType: Constants.UPDATE_ITEM, 
            item
        });
    },
    
    removeItem: function (id) {
        Dispatcher.dispatch({
            actionType: Constants.REMOVE_ITEM, id
        });
    },
    
    initSocialLogin: function(){
        Dispatcher.dispatch({ actionType: Constants.INIT_SOCIAL });
        
        let userEmail = null;
        let clientsLoaded = false;
        
        GoogleApiLoader.authLoaded(() => {
            console.log('GoogleApiLoader.authLoaded.');  
            Dispatcher.dispatch({ actionType: Constants.READY_SOCIAL });
            
            const auth2 = GoogleApiLoader.getAuth2();
            
            auth2.currentUser.listen((user) => {
                console.log('GoogleApiLoader.currentUser changed.', user);          
    
                const isLoggedIn = auth2.isSignedIn.get();
                if (isLoggedIn) {
                    const profile = user.getBasicProfile();
                    console.log('user profile=', profile);
                    const userProfile = {};
                    userProfile.id = profile.getId();
                    userProfile.name = profile.getName();
                    userProfile.thumb = profile.getImageUrl();
                    userProfile.email = profile.getEmail();
                    
                    Dispatcher.dispatch({ actionType: Constants.SIGNIN, user: userProfile});

                    userEmail = userProfile.email;                    
          	        getGoogleEvents();
              } else {
                    userEmail = null;
                    Dispatcher.dispatch({ actionType: Constants.SIGNOUT });
                }
            });
        });
    
        GoogleApiLoader.clientsLoaded(() => {
            clientsLoaded = true;
            console.log('GoogleApiLoader.clientsLoaded.');
	        getGoogleEvents();
        });
        
    	function getGoogleEvents() {
            console.log('getGoogleEvents email='+ userEmail, clientsLoaded);	   
            if (!userEmail || !clientsLoaded) { 
                return;
            }
            
            Dispatcher.dispatch({ actionType: Constants.BEGIN_GETCALENDAR });

            const request = gapi.client.calendar.events.list({
              'calendarId': userEmail, //'primary',
              'timeMin': (new Date()).toISOString(),
              'showDeleted': false,
              'singleEvents': true,
              'maxResults': 30,
              'orderBy': 'startTime'
            });
            
            request.execute(procGoogleEvents);
    	}
    	
    	function procGoogleEvents(resp) {
            //console.log('getGoogleEvents response', resp);
            
            if (resp.error){
                const msg = resp.error.message;
                alert('Cannot access calendar info. Please sign in again.\n\n' + msg);
                Dispatcher.dispatch({ actionType: Constants.END_GETCALENDAR, events: null  });
                GoogleApiLoader.signOut();
                return;
              }
            const events = resp.items;
            //console.log('Upcoming events:', events);
            
            if (events.length == 0) {
                console.log('No upcoming events found.');
                Dispatcher.dispatch({ actionType: Constants.END_GETCALENDAR, events: null });
                return;
            }
            Dispatcher.dispatch({ actionType: Constants.END_GETCALENDAR, events: events });
        }
    	
        
    }
    
};

module.exports = Actions;