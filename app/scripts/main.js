/* jshint devel:true */
var React = require('react');
var ChatApp = require('./components/ChatApp.react');

window.React = React;

React.render(
    <ChatApp />,
    document.getElementById('react')
);
