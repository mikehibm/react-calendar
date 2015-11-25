const React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('director').Router,
      Store = require('./store.jsx'),
      Actions = require('./actions.jsx');

const App = React.createClass({
  getInitialState: function() {
    return Store.getState();
  },
  
  componentDidMount: function () {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    Store.removeChangeListener(this._onChange);
  },
  
  render: function() {
    var list = this.state.items.map(function(item){
      return <li key={ item.id }>{ item.text }</li>
    });
    return (
      <div>
        カレンダーです。<br />
        { list }
      </div>
    );
  },
  
  _onChange: function () {
    this.setState(Store.getState());
  }  
});


//Define routes.
var router = Router({
  '/': function(){ Actions.showAll(); },
  '/active': function(){ Actions.showActive(); },
  '/completed': function(){ Actions.showCompleted(); }
})
.configure({
  'notfound': function(){ Actions.showAll(); },
  'html5history': false
})
.init();


ReactDOM.render(
  <App />,
  document.getElementsByClassName('calenderapp')[0]
);
