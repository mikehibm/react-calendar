/* global moment */
import { EventEmitter } from 'events';
import Dispatcher from './dispatcher.jsx';
import Constants from './constants.jsx';
import Utils from './utils.jsx';

let currentDate = moment().startOf('day').toDate();
let selectedDate = currentDate;
let isDialogOpen = false;

let items = [];
let itemFilter = Constants.ItemFilter.ALL;

const Store = Object.assign(EventEmitter.prototype, {
    
    moveMonth: function(offset){
        currentDate = moment(currentDate).add(offset, 'months').toDate();
        Store.emitChange();
    },
    
    getItem: function (id) {
        return items.find(function(item){
            return item.id === id;
        });
    },
    
    openItem: function(date, text){
        selectedDate = date;
        isDialogOpen = true;
        Store.emitChange();
    },
    
    closeItem: function(){
        isDialogOpen = false;
        Store.emitChange();
    },
    
    addItem: function(date, time, text){
        console.log('addItem: ', date, time, text);
        items.push({ 
            id: Utils.uuid(), 
            date: moment(date).format("YYYY/MM/DD"), 
            time: moment(time).format("HH:mm"), 
            text: text 
        });
        console.table(items);
        Store.emitChange();
    },

    editItem: function(id, date, time, text){
        var item = Store.getItem(id);
        if (item){
            item.date = date;
            item.time = time;
            item.text = text;            
        }
        Store.emitChange();
    },

    removeItem: function(id){
        items = items.filter(function(item){
            return item.id !== id;
        });
        Store.emitChange();
    },

    getState: function () {
        // var filtered_items = items.filter(function(item){
        //     return (itemFilter == Constants.ItemFilter.ALL) 
        //             || (itemFilter == Constants.ItemFilter.ACTIVE && !item.checked)
        //             || (itemFilter == Constants.ItemFilter.COMPLETED && item.checked);
        // });
        
        // let year = currentDate.getFullYear();
        // let month = currentDate.getMonth() + 1;
        
        return { 
            currentDate,
            selectedDate,
            isDialogOpen,
            items,
            itemFilter
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
            Store.openItem(action.date, action.text);
            break;
            
        case Constants.CLOSE_ITEM:
            Store.closeItem();
            break;
            
        case Constants.ADD_ITEM:
            Store.addItem(action.date, action.time, action.text);
            break;

        case Constants.EDIT_ITEM:
            Store.editItem(action.id, action.date, action.time, action.text);
            break;

        case Constants.REMOVE_ITEM:
            Store.removeItem(action.id);
            break;

        case Constants.SHOW_ALL:
            itemFilter = Constants.ItemFilter.ALL;
            Store.emitChange();
            break;

        case Constants.SHOW_ACTIVE:
            itemFilter = Constants.ItemFilter.ACTIVE;
            Store.emitChange();
            break;

        case Constants.SHOW_COMPLETED:
            itemFilter = Constants.ItemFilter.COMPLETED;
            Store.emitChange();
            break;

        default:
            // no op
    };
});

Store.load();

module.exports = Store;