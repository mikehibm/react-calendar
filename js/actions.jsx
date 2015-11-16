
const Dispatcher = require('./dispatcher.jsx'),
      Constants = require('./constants.jsx');

const Actions = {
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
    
    toggleItem: function (id) {
        Dispatcher.dispatch({
            actionType: Constants.TOGGLE_ITEM,
            id: id
        });
    },
    
    toggleAll: function(){
        Dispatcher.dispatch({
            actionType: Constants.TOGGLE_ALL
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
    },

    clearCompleted: function(){
        Dispatcher.dispatch({
            actionType: Constants.CLEAR_COMPLETED
        });
    }
    
};

module.exports = Actions;