# REACT - FLUX
-------


#React 
--------

## Components:

When using Render method, our first argument is the component we want to render, and the 2nd is the DOM node it should mount to. We can use `createClass` method to create custome component classes. It takes an object of specifications as it's argument.

```js
var MyComponent = React.createClass({
    render: function(){
        return (
            <h1>Hello, world!</h1>
        );
    }
});

```

Then render it out like below:

```js
React.render(
    <MyComponent />,
    document.getElementById('myDiv')
)
```

suppa Ez?


## Props

When we use our defined components, we can add attributes called props. These attributes are available in our component  as `this.props` and can be used in our render method to render dynamic data:


```js
var MyComponent = React.createClass({
    render: function(){
        return (
            <h1>Hello, {this.props.name}!</h1>
        );
    }
});

React.render(<MyComponent name="Handsome" />, document.getElementById('myDiv'));
```

## Specs, Lifecycle & State

The `render` method is only required spec for creating a component but, there are serveral lifecycle methods and spec we can use that are mighty helpful when you actually want your component to do anything.

### Lifecycle Methods

+ **componentWillMount** : Invoked once, on both client & server before rendering occurs.
+ **componentDidMount**: Invoked once, only on the client, after rendering occurs.
+ **shouldComponentUpdate**: Return value determines whether component should update.
+ **componentWillUnmount**: Invoked prior to unmounting component.

### Specs

+ **getInitialState**: Return value is the initial value for state.
+ **getDefaultProps**: Sets fallback props value if props aren't supplied.
+ **mixins**:  An array of objects, used to extend the current component's functionality.
    
### State

Every component may has a `state` object and a `props` (read more about different between `props` and `state` at [here](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)). When calling `setState` triggers UI updates and is the bread and butter of React's interactivity (In my opinion this is a point of difference of React with another). If we want to set an initial state before any interaction occurs we can use the `getInitialState` method. 

```js
var MyComponent = React.createClass({
    getInitialState: function(){
        return {
            count: 5
        }
    },
    render: function(){
        return (
            <h1>{this.state.count}</h1>
        )
    }
});
```

##Events

React also has a built in cross browser events system. The events are attached as properties of components and can trigger methods. Lets make our count increment using events

```js
var Counter = React.createClass({
  incrementCount: function(){
    this.setState({
      count: this.state.count + 1
    });
  },
  getInitialState: function(){
     return {
       count: 0
     }
  },
  render: function(){
    return (
      <div class="my-component">
        <h1>Count: {this.state.count}</h1>
        <button type="button" onClick={this.incrementCount}>Increment</button>
      </div>
    );
  }
});

React.render(<Counter/>, document.getElementById('mount-point'));
```


## Unidirectional Data Flow

In React, application data flows unidirectional via the `state` and `props` objects, as opposed  to the two-way binding of libraries like Angular. This means that, in a multi component heriachy, a common parent component should manage the state and pass it down the chain via props.

Your state should be updatead using the `setState` method to ensure that a UI refresh will occur, if necessary. The resulting values should be passed down to child components using attributes that are accessible in said children via `this.props`.

```js
var FilteredList = React.createClass({
  filterList: function(event){
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedList});
  },
  getInitialState: function(){
     return {
       initialItems: [
         "Apples",
         "Broccoli",
         "Chicken",
         "Duck",
         "Eggs",
         "Fish",
         "Granola",
         "Hash Browns"
       ],
       items: []
     }
  },
  componentWillMount: function(){
    this.setState({items: this.state.initialItems})
  },
  render: function(){
    return (
      <div className="filter-list">
        <input type="text" placeholder="Search" onChange={this.filterList}/>
      <List items={this.state.items}/>
      </div>
    );
  }
});

var List = React.createClass({
  render: function(){
    return (
      <ul>
      {
        this.props.items.map(function(item) {
          return <li key={item}>{item}</li>
        })
       }
      </ul>
    )  
  }
});

React.render(<FilteredList/>, document.getElementById('mount-point'));
```


#Flux
>scotch.io

>Simply, Flux is an architecture that Facebook uses internally when working with React. Flux complements React and the concept of Unidirectional Data Flow.

Individual components of Flux:
- **Actions:** Helper methods that facilitate passing data to the Dispatcher
- **Dispatcher:** Receives actions and broadcasts payloads to registered callbacks. `Dispatcher` along with Nodejs's EventEmitter module in order to set up an event systems that helps manage an application state.
- **Stores:** Containers for application state and logic that have callbacks registerd to the `Dispatcher`.
- **Controller-View-React:** Components that grab the state from Stores and pass it down via props to child components

![Architecture](https://facebook.github.io/flux/img/flux-simple-f8-diagram-explained-1300w.png "architecture image")

##The Dispatcher

- The `Dispatcher` is basically the manager of this entire process. It is the central hub for your application. The `Dispatcher ` receives actions and dispatches the actions and data to registered callbacks.
- The `Dispatcher` not exactly is pub/sub. The `Dispatcher` broadcasts the payload to **all** of its registered callbacks, and includes functionality that allows you to invoke the callbacks in a specific order, even waiting for updates before proceeding. There is only ever **one** `Dispatcher`, and it acts as the centeral hub within your application.

```js
var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

AppDispatcher.handleViewAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}

module.exports = AppDispatcher;
```

In the above example, we create an instance of our Dispatcher and create a `handleViewAction` method. This abstraction is helpful if you are looking to distinguish between view triggered action v.s server/API triggered actions.

### Dependencies

One of the coolest part of the provided Dispatcher module is the ability to define dependencies and marshall the callbacks on our `Store`. So if one party of your application is dependent uponi another party being updated first, in order to render properly, the Dispatcher's `waitFor()` method will be mighty usefull.

In order to utilizie this feature, we need to store the return value of the Dispatcher's regsitration method on our Store as `dispatcherIndex` or `dispatcherToken`:

```js
ShoeStore.dispatcherIndex = AppDispatcher.register(function(payload){
// blah blah
});
// Above same below
// ShoeStore.dispatcherToken = AppDispatcher.regsiter(function(payload) {
// //blah blah
// });
```

Then in our Store, when handling a dispatcher action, we can use the Dispatcher's `waitFor()` method to ensure our ShoeStore has been updated:

```js
CheckoutStore.dispatcherIndex = AppDispatcher.register(function(payload) {
    switch(payload.actionType) {
        case 'BUY_SHOE':
            // now if this case.
            // The `CheckoutStore` will wait for ShoeStore updated
            AppDispatcher.waitFor([
                ShoeStore.dispatcherIndex
            ], function () {
                // after the `CheckoutStore` update
                CheckoutStore.purchaseShoes(ShoeStore.getSelectedShoes());
            });
            break;
    }
});
```

> More example about dispatcher

The example in file `Dispatcher.js`, consider this hypothetical flight desitination form, which selects a default city when a country is selected:

```js
var flightDispatcher = new Dispatcher();

// Keeps track of which country is selected
var CityStore = {country: null};

// Keeps track of the base flight price of the selected city
var FlightPriceStore = {price: null};
```

When a user changes the selected city, we dispatch the payload: 

```js
flightDispatcher.dispatch({
    actionType: 'city-update',
    selectedCity: 'paris'
});
```

This payload is digested by `CityStore`:

```js
flightDispatcher.register(function(payload) {
    if(playload.actionType === 'city-update') {
        CityStore.city = payload.selectedCity;
    }
});
```

When the user selects a country, we dispatch the payload:

```js
flightDispatcher.dispatch({
    actionType: 'country-update',
    selectedCountry: 'australia'
});
```

This payload is disgested by both stores:

```js
CountryStore.dispatchToken = flightDispatcher.regsiter(function(payload) {
    if(payload.actionType === 'country-update') {
        CountryStore.country = payload.selectedCountry;
    }
});
```

When the callback to update `CountryStore` is resigtered, we save a reference to the returned token. Using this token with `waitFor()`, we can guarantee that `CountryStore` is updated before the callback that updates `CityStore` needs to query its data.

```js
CityStore.dispatchToken = flightDispatcher.register(function(payload) {
    if(payload.actionType === 'country-update') {
        // `CountryStore` may not be updated.
        flightDispatcher.waitfFor([CountryStore.dispatchToken]);
    }
});
```

The usage of `waitFor()` can be chained, for example:

```js
FlightPriceStore.dispatchToken = flightDispatcher.register(function(payload) {
    switch(payload.actionType) {

        case 'country-update':
            flightDispatcher.waitFor([CityStore.dispatcherToken]);
            FlightPriceStore.price = getFlightPriceStore(CountryStore.country, CityStore.city);
            break;

        case 'city-update':
            FlightPriceStore.price = FlightPriceStore(CountryStore.country, CityStore.city);
            break;
    }
});
```

Now the payload `country-update` will be guaranteed to invoke the stores registered callback in order: `CoutryStore`, `CityStore`, then `FlightPriceStore`.


## Stores
In Flux, `Stores` manage application state for particular domain within your application. From a high level, this basically mean that per app section, store manage the data, data retrieval methods and dispatcher callbacks.

```js
    /**
     * Folder structure will like example [TodoList](https://github.com/facebook/flux/tree/master/examples/flux-todomvc/)
     */
    var AppDispatcher = require('../dispatcher/AppDispatcher'),
        ShoeConstants = require('../constants/ShoeConstants'),

        EventEmitter = require('events').EventEmitter,
        // [object-assign](https://github.com/sindresorhus/object-assign)
        objectAssign = require('object-assign');

    // Internal object of shoe
    var _shoes = {};

    // Method to load shoes from action data
    var loadShoes = function(data) {
        _shoes = data.shoes;
    };

    // Extend our store with Node's Event Emitter
    var ShoeStore = objectAssign({}, EventEmiiter.prototype, {

        // Return all nodes
        getShoes: function() {
            return _shoes;
        },

        emitChange: function() {
            this.emit('change');
        },

        addChangeListener: function(callback) {
            this.on('change', callback);
        },

        removeChangeListener: function(callback) {
            this.removeListener('change', callback);
        }
    });

    // Register dispatcher callback
    AppDispatcher.register(function(payload) {
        var action = payload.action,
            text;

        switch(action.actionType) {
            case ShoeContants.LOAD_SHOES:

                // Call internal method based upon dispatched action
                loadShoes(action.data);
                break;
            default:
                return true;
        };

        // If action was acted upon, emit change event
        ShoeStore.emitChange();
        return true;
    });

    module.exports = ShoeStore;
```

The most important thing we did above is to extend our store with Nodejs's **EventEmitter**. This allows our stores to listen/broadcast events. This allows our Views/Components to update based upon those events. Because our **ControllerView** listens to our Stores, leveraging this to emit change events will let our **ControllerView** know that our application state has changed and its tim to retrieve the state to keep things fresh.

![scotch.io](https://cask.scotch.io/2014/10/rHwGUog.png "scotch.io")

We also registered a callback with out `AppDispatcher` using its `register` method. This means that our Store is now listening to `AppDispatcher` broadcasts. Our switch statement determines whether, for a given broadcast, if there are relevant actions to take. If a relevan action is taken, a change event is emitted, and views that are listening for this event update their states.

Our public method `getShoes` is used by our ControllerView to retrieve all of the shoes in our `_shoes` object and use that data in our component state. While this is a simple example, complicated logic can be put here instead of our views and helps keep things tidy.

## Action Creators & Actions

Action Creators are collections of methods that are called within views(or anywhere else for that matter) to send actions to the Dispatcher. Actions are the actual payloads that are delivered via the dispatcher.

The way Facebook uses them, action type constants are used to define what action should take place, and are sent along with action data. Inside of registered callbacks, these actions can now be handled according to their action type, and methods can be called with action data as the argurments.

Lets check out a constans definition:

```js
var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
    LOAD_SHOES: null
});
```

Above we use React's `keyMirror` library to mirror our keys so that our value matches our key definition. Just by looking at this file, we can tell that our app loads shoes. The use of constants helps keep things organized, and helps give a high level view of what the app actually does.

Take a look at the corresponding Action creator definition:

```js
// action

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ShoeStoreConstants = require('../constants/ShoeStoreConstants'),

    ShoeStoreActions = {
        loadShoes: function(data) {
            AppDispatcher.handleAction({
                actionType: ShoeStoreContants.LOAD_SHOES,
                data: data
            })
        }
    };
module.exports = ShoeStoreActions;
```

In our example above, we created a method on our `ShoeStoreActions` object that calls our dispatcher with the data we provided. We can now import this actions file into our view or API, and call `ShoeStoreActions.loadShoes(ourData)` to send our payload to the Dispatcher, wich will broadcast it. Then the ShoeStore will hear that event call a method thats load up some shoes.

## Controler Views

Controller views are really just React components that listen to change events and retrieve **Application** state from **Stores**. Then they pass that data down to their child component via props.

![scotch.io](https://cask.scotch.io/2014/10/4tBnC0e.png "scotch.io")

```js
var React = require('react'),
    ShoeStore = require('../stores/ShoeStore');

// Method to retrieve application state form store
function getAppState() {
    return {
        shoes: ShoeStore.getShoes()
    };
}

// Create our component class
var ShoeStoreApp = React.createClass({

    // Use getAppState method to set initial state
    getInitialState: function() {
        return getAppState();
    },

    // Listen for changes
    componentDidMount: function() {
        ShoeStore.addChangeListener(this._onChange);
    },

    // Unbind change listener
    componentWillUnmnont: function() {
        ShoeStore.removeChangeListener(this._onChange);
    },

    render: function() {
        return (
            <ShoeStore shoes={this.state.shoes} />
            //\//
        );
    },

    //Update View state when change event is receivied
    _onChange: function() {
        this.setState(getAppState());
    }
});

module.exports = ShoeStoreApp;
```

In the example above, we listen for change events using addChangeListener, and update our application state when the event is recevied.

Our application state data is held in our Stores, so we use the public methods on the Stores to retrieve that data and then set our application state.

## Putting it All Together


![scotch.io](https://cask.scotch.io/2014/10/duZH2Sz.png "scotch.io")
