import Dispatcher from './dispatcher.jsx';
import Constants from './constants.jsx';

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
        Dispatcher.dispatch({
            actionType: Constants.ADD_ITEM, date, time, text
        });
    },
    
    updateItem: function(id, date, time, text){
        Dispatcher.dispatch({
            actionType: Constants.UPDATE_ITEM, id, date, time, text
        });
    },
    
    removeItem: function (id) {
        Dispatcher.dispatch({
            actionType: Constants.REMOVE_ITEM, id
        });
    },
    
};

module.exports = Actions;