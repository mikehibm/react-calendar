const EventEmitter = require('events').EventEmitter,
      Dispatcher = require('./dispatcher.jsx'),
      Constants = require('./constants.jsx'),
      Utils = require('./utils.jsx');

const CHANGE_EVENT = 'change',
      DBNAME = 'calendar';

var items = [
        { id:"10001", text:"アイテム1",  date:"2015/12/01", time:"09:00" },
        { id:"10002", text:"アイテム2",  date:"2015/12/03", time:"10:00" },
        { id:"10003", text:"アイテム3",  date:"2015/12/03", time:"12:20" },
        { id:"10004", text:"アイテム4",  date:"2015/12/10", time:"15:35" },
        { id:"10005", text:"アイテム5",  date:"2015/12/11", time:"15:30" },
    ];
var itemFilter = Constants.ItemFilter.ALL;

const Store = Object.assign(EventEmitter.prototype, {
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
        
        return { 
            items: items,//filtered_items,
            itemFilter: itemFilter
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