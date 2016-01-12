const EventEmitter = require('events').EventEmitter,
      Dispatcher = require('./dispatcher.jsx'),
      Constants = require('./constants.jsx'),
      Utils = require('./utils.jsx');

const CHANGE_EVENT = 'change',
      DBNAME = 'calendar';
      
/* global moment */

let currentDate = moment().startOf('day').toDate();
let items = [
        { id:"10001", text:"アイテム1",  date:"2016/01/01", time:"09:00" },
        { id:"10002", text:"アイテム2",  date:"2016/01/03", time:"10:00" },
        { id:"10003", text:"アイテム3",  date:"2016/01/03", time:"12:20" },
        { id:"10004", text:"アイテム4",  date:"2016/01/10", time:"15:35" },
        { id:"10005", text:"アイテム5",  date:"2016/01/11", time:"15:30" },
        { id:"10006", text:"VS Meeting",  date:"2016/01/12", time:"13:30" },
        { id:"10007", text:"ProjectM ミーティング",  date:"2016/01/12", time:"15:00" },
        { id:"10008", text:"アイテム8",  date:"2016/02/10", time:"15:30" },
        { id:"10009", text:"アイテム9",  date:"2016/02/16", time:"15:30" },
        { id:"10010", text:"アイテム10",  date:"2016/02/28", time:"15:30" },
    ];
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
    
    addItem: function(text, date, time){
        items.push({ id: Utils.uuid(), text: text, date: date, time: time });
        Store.emitChange();
    },

    editItem: function(id, text){
        var item = Store.getItem(id);
        item && (item.text = text);
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
        
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        
        return { 
            currentDate,
            items: items,//filtered_items,
            itemFilter
        };
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.off(CHANGE_EVENT, callback);
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
        Store.save();
    },
    
    save: function(){
        localStorage.setItem(DBNAME, JSON.stringify(items));
    },
    
    load: function(){
        var data = localStorage.getItem(DBNAME);
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

        case Constants.ADD_ITEM:
            Store.addItem(action.text, action.checked);
            break;

        case Constants.EDIT_ITEM:
            Store.editItem(action.id, action.text);
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

//Store.load();

module.exports = Store;