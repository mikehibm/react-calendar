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
    
    openItem: function (date, text) {
        Dispatcher.dispatch({
            actionType: Constants.OPEN_ITEM,
            date: date,
            text: text
        });
    },
    
    closeItem: function () {
        Dispatcher.dispatch({
            actionType: Constants.CLOSE_ITEM
        });
    },
    
    addItem: function (date, time, text) {
        Dispatcher.dispatch({
            actionType: Constants.ADD_ITEM,
            date: date,
            time: time,
            text: text
        });
    },
    
    editItem: function(id, date, time, text){
        Dispatcher.dispatch({
            actionType: Constants.EDIT_ITEM,
            id: id,
            date: date,
            time: time,
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