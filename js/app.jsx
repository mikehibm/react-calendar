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
    const days = [], dayHeader = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    dayNames.forEach(function(item, index){
      dayHeader.push(<div key={ index }>{ item }</div>);
    });
    
    for (let i = 0; i < 31; i++){
      days.push(<div key={i} className={'day ' + dayNames[ i % 7 ]}>{ i+1 }</div>);
    }
    
    let items = this.state.items.map(function(item){
      return <li key={ item.id }>{ item.text }</li>
    });
    return (
      <section>
        <header>
          { this.state.year}年 { this.state.month }月
        </header>
        <div className='dayHeader'>
          { dayHeader }
        </div>
        <div className='days'>
          { days }
        </div>
        <div className='items'>
          { items }
        </div>
      </section>
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
