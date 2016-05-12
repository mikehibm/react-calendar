/* global gapi */
import app_settings from './gapi_settings.jsx'

var clientsLoaded = 0;
var sign2Loaded = false;
var auth2Loaded = false;
var auth2;

if (app_settings.scopes.indexOf('profile') === -1){
    app_settings.scopes.push('profile');
}

module.exports = {
    clientsLoaded: function (callback) {
        var ids = 0;
        var clientsLoadedCheck = function () {
            if (ids++ > 1000 || app_settings.libraries.length === clientsLoaded) {
                callback();
            }
            else {
                setTimeout(() => clientsLoadedCheck(), 50);
            }
        };

        clientsLoadedCheck();
    },
    
    authLoaded: function (callback) {
        var authLoadedCheck = function () {
            if (auth2Loaded && sign2Loaded) {
                callback();
            }
            else {
                setTimeout(() => authLoadedCheck(), 50);
            }
        };

        authLoadedCheck();
    },
    
    gapiLoaded: function (callback) {
        var hasgapi = function () {
            if (typeof (gapi) !== "undefined" && gapi.client) {
                callback();
            }
            else {
                setTimeout(() => hasgapi(), 50);
            }
        };

        hasgapi();
    },
    
    getAuth2: function () {
        return auth2;
    },
    
    signIn: function () {
        return auth2.signIn();
    },
    
    signOut: function(){
    	return auth2.signOut();
    },
    
    renderSignInButton : function(button_id, options){
        console.log('renderSignInButton to ' + button_id);
        gapi.signin2.render(button_id, options);   
    }
};


module.exports.gapiLoaded(function () {

    gapi.load('auth2', () => {
        auth2 = gapi.auth2.init({
            client_id: app_settings.client_id,
            scope: app_settings.scopes.join(' ')
        });
        auth2Loaded = true;
    });

    gapi.load('signin2', () => { sign2Loaded = true; });

    for (var i = 0; i < app_settings.libraries.length; i++) {
        var client = app_settings.libraries[i];
        gapi.client.load(client.name, client.version, () => { clientsLoaded++; });
    }
});