import Dispatcher from './dispatcher.jsx';
import Constants from './constants.jsx';
import Item from './item.jsx';

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
        const item = new Item('', date, time, text);
        const msg = item.valiate();
        if (msg){
            return msg;
        }
        
        Dispatcher.dispatch({
            actionType: Constants.ADD_ITEM, 
            item
        });
    },
    
    updateItem: function(id, date, time, text){
        const item = new Item(id, date, time, text);
        const msg = item.valiate();
        if (msg){
            return msg;
        }
        
        Dispatcher.dispatch({
            actionType: Constants.UPDATE_ITEM, 
            item
        });
    },
    
    removeItem: function (id) {
        Dispatcher.dispatch({
            actionType: Constants.REMOVE_ITEM, id
        });
    },
    
};

module.exports = Actions;