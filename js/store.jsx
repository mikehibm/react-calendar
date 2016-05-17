/* global moment */
import { EventEmitter } from 'events';
import Dispatcher from './dispatcher.jsx';
import Constants from './constants.jsx';
import Utils from './utils.jsx';
import Item from './item.jsx';

let currentDate = moment().startOf('day').toDate();
let selectedDate = currentDate;
let selectedItem = {};
let isDialogOpen = false;
let items = [];

let socialLoginInitializing = false;
let getCalendarInProgress = false;
let user = null;
let isLoggedIn = false;

const Store = Object.assign(EventEmitter.prototype, {
    
    moveMonth: function(offset){
        currentDate = moment(currentDate).add(offset, 'months').toDate();
        Store.emitChange();
    },
    
    getItem: function (id) {
        return items.find(item => item.id === id);
    },
    
    openItem: function(date, item){
        selectedDate = date || new Date();
        selectedItem = Object.assign({}, { 
            date: moment(selectedDate).format("YYYY/MM/DD"), 
            time: '00:00',
            text: ''
        }, item);
        console.log("selectedItem", selectedItem);
        isDialogOpen = true;
        Store.emitChange();
    },
    
    closeItem: function(){
        isDialogOpen = false;
        Store.emitChange();
    },
    
    addItem: function(item){
        console.log('Store: addItem: ', item);
        Store.addItemSub(item);
        console.table(items);
        Store.emitChange();
    },
    
    addItemSub: function(item){
        item.time = item.time || moment('00:00', 'HH:mm');
        const newItem = new Item(
                    Utils.uuid(), 
                    moment(item.date).format("YYYY/MM/DD"),
                    moment(item.time).format("HH:mm"),
                    item.text,
                    item.synced || false
                );
        items.push(newItem);
    },

    updateItem: function(item){
        console.log('Store: updateItem: ', item);
        item.time = item.time || moment('00:00', 'HH:mm');
        const existingItem = Store.getItem(item.id);
        if (existingItem){
            existingItem.date = moment(item.date).format("YYYY/MM/DD");
            existingItem.time = moment(item.time).format("HH:mm");
            existingItem.text = item.text;            
        } else {
            console.log('Store: updateItem: NOT FOUND. id=', id);
        }
        console.table(items);
        Store.emitChange();
    },

    removeItem: function(id){
        items = items.filter(function(item){
            return item.id !== id;
        });
        console.table(items);
        Store.emitChange();
    },

    getState: function () {
        return { 
            currentDate,
            selectedDate,
            selectedItem,
            isDialogOpen,
            items,
            socialLoginInitializing,
            getCalendarInProgress,
            user,
            isLoggedIn
        };
    },

    addChangeListener: function (callback) {
        this.on(Constants.CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.off(Constants.CHANGE_EVENT, callback);
    },

    emitChange: function () {
        this.emit(Constants.CHANGE_EVENT);
        Store.save();
    },
    
    save: function(){
        localStorage.setItem(Constants.DBNAME, JSON.stringify(items));
    },
    
    load: function(){
        var data = localStorage.getItem(Constants.DBNAME);
        data = data && JSON.parse(data);
        items = data || [];
    },
    
    initSocialLogin: function(){
        socialLoginInitializing = true;
        Store.emitChange();
    },
    
    readySocialLogin: function(){
        socialLoginInitializing = false;
        Store.emitChange();
    },
    
    signIn: function(loggedInUser){
        user = loggedInUser;
        isLoggedIn = !!loggedInUser;
        Store.emitChange();
    },
    
    signOut: function(){
        user = null;
        isLoggedIn = false;
        Store.clearSyncedEvents();
        Store.emitChange();
    },
    
    clearSyncedEvents: function(){
        items = items.filter((item) => !item.synced);
    },
    
    beginGetCalendar: function(){
        getCalendarInProgress = true;
        Store.clearSyncedEvents();
        Store.emitChange();
    },
    
    endGetCalendar: function(events){
        if (events){
            const newItems = events.map((i) => {
                var when = i.start.dateTime || i.start.date;
                //console.log(i.summary + ' (' + when + ')', i);
                return new Item(
                        null, 
                        when,
                        when,
                        i.summary,
                        true
                    );
            });
            
            newItems.forEach((item) => {
                Store.addItemSub(item);
            });
        }
        getCalendarInProgress = false;
        Store.emitChange();
    }
});

Dispatcher.register(function (action) {
    switch (action.actionType) {
        case Constants.PREV_MONTH:
            Store.moveMonth(-1);
            break;

        case Constants.NEXT_MONTH:
            Store.moveMonth(1);
            break;

        case Constants.OPEN_ITEM:
            Store.openItem(action.date, action.item);
            break;
            
        case Constants.CLOSE_ITEM:
            Store.closeItem();
            break;
            
        case Constants.ADD_ITEM:
            Store.addItem(action.item);
            break;

        case Constants.UPDATE_ITEM:
            Store.updateItem(action.item);
            break;

        case Constants.REMOVE_ITEM:
            Store.removeItem(action.id);
            break;

        case Constants.SHOW_ALL:
            Store.emitChange();
            break;
            
        case Constants.INIT_SOCIAL:
            Store.initSocialLogin();
            break;
            
        case Constants.READY_SOCIAL:
            Store.readySocialLogin();
            break;
            
        case Constants.SIGNIN:
            Store.signIn(action.user);
            break;
            
        case Constants.SIGNOUT:
            Store.signOut();
            break;
            
        case Constants.BEGIN_GETCALENDAR:
            Store.beginGetCalendar();        
            break;
            
        case Constants.END_GETCALENDAR:
            Store.endGetCalendar(action.events);
            break;

        default:
            // no op
    };
});

Store.load();

module.exports = Store;