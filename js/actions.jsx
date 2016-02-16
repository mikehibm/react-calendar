
const Dispatcher = require('./dispatcher.jsx'),
      Constants = require('./constants.jsx');

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
    
    showItem: function (date, text) {
        Dispatcher.dispatch({
            actionType: Constants.SHOW_ITEM,
            date: date,
            text: text
        });
    },
    
    addItem: function (text) {
        Dispatcher.dispatch({
            actionType: Constants.ADD_ITEM,
            text: text,
            checked: false
        });
    },
    
    editItem: function(id, text){
        Dispatcher.dispatch({
            actionType: Constants.EDIT_ITEM,
            id: id,
            text: text
        });
    },
    
    removeItem: function (id) {
        Dispatcher.dispatch({
            actionType: Constants.REMOVE_ITEM,
            id: id
        });
    },
    
    showAll: function(){
        Dispatcher.dispatch({
            actionType: Constants.SHOW_ALL
        });
    },
    
    showActive: function(){
        Dispatcher.dispatch({
            actionType: Constants.SHOW_ACTIVE
        });
    },
    
    showCompleted: function(){
        Dispatcher.dispatch({
            actionType: Constants.SHOW_COMPLETED
        });
    }

};

module.exports = Actions;