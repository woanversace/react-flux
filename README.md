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
