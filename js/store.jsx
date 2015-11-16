const EventEmitter = require('events').EventEmitter,
      Dispatcher = require('./dispatcher.jsx'),
      Constants = require('./constants.jsx'),
      Utils = require('./utils.jsx');

const CHANGE_EVENT = 'change',
      DBNAME = 'todo';

var items = [];
var itemFilter = Constants.ItemFilter.ALL;

const Store = Object.assign(EventEmitter.prototype, {
    getItem: function (id) {
        return items.find(function(item){
            return item.id === id;
        });
    },
    
    addItem: function(text, checked){
        items.push({ id: Utils.uuid(), text: text, checked: checked });
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

    toggleItem: function(id){
        var item = Store.getItem(id);
        item && (item.checked = !item.checked);
        Store.emitChange();
    },
    
    toggleAll: function(){
        var new_value = !Store.isAllChecked();
        items = items.map(function(item){
          return { id: item.id, text: item.text, checked: new_value };
        });
        Store.emitChange();
    },
    
    removeCompletedItem: function(){
        items = items.filter(function(item){
            return !item.checked;
        });
        Store.emitChange();
    },
    
    getCompletedItems: function(){
        var list = items.filter(function(item){
          return item.checked;
        });
        return list;
    },
    
    getIncompleteItems: function(){
        var list = items.filter(function(item){
          return !item.checked;
        });
        return list;
    },
    
    isAllChecked: function(){
        return items.every(function(item){ return item.checked })
    },

    getState: function () {
        var filtered_items = items.filter(function(item){
            return (itemFilter == Constants.ItemFilter.ALL) 
                    || (itemFilter == Constants.ItemFilter.ACTIVE && !item.checked)
                    || (itemFilter == Constants.ItemFilter.COMPLETED && item.checked);
        });
        
        var countTodo = Store.getIncompleteItems().length;
        var countCompleted = Store.getCompletedItems().length;
        
        return { 
            items: filtered_items,
            isAllChecked: Store.isAllChecked() ,
            countTodo: countTodo,
            itemFilter: itemFilter,
            hasCompleted: (countCompleted > 0)
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

        case Constants.TOGGLE_ITEM:
            Store.toggleItem(action.id);
            break;

        case Constants.TOGGLE_ALL:
            Store.toggleAll();
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

        case Constants.CLEAR_COMPLETED:
            Store.removeCompletedItem();
            break;

        case Constants.EDIT_ITEM:
            Store.editItem(action.id, action.text);
            break;

        default:
            // no op
    };
});

Store.load();

module.exports = Store;