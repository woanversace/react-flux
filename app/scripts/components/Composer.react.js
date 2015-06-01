'use strict';


var React = require('react'),
    ReactPropTypes = React.PropTypes,

    UserActions = require('../actions/UserActions');

var ENTER_KEY_CODE = 13;


/**
 * [Composer description]
 * This is an intput to write and send message
 */
var Composer = React.createClass({

    propTypes: {
        userTarget: ReactPropTypes.object,
        userId: ReactPropTypes.string
    },

    getInitialState: function() {
        return {
            text:''
        };
    },

    render: function() {
        return (
            <div>
                <div className="input-group">
                    <input
                        name="message"
                        type="text"
                        value={this.state.text}
                        className="form-control"
                        placeholder="Type a message"
                        aria-describedby="basic-addon2"
                        onChange={this._onChange}
                        onKeyDown={this._onKeyDown}
                    />

                    <span className="input-group-btn">
                        <button
                            className="btn btn-default"
                            type="button"
                            onClick={this._onClick}

                        >Send!

                        </button>
                    </span>
                </div>
            </div>
        );
    },

    _onChange: function(e, value) {
        this.setState({
            text: e.target.value
        });
    },


    /**
     * [_onKeyDown description]
     * When call this function it will call an Actiont.CreateMessage
     * to send payload to store.
     */
    _onKeyDown: function(e) {

        if(e.keyCode === ENTER_KEY_CODE) {
            var message = {
                message: '',
                time:'',
                id: this.props.userId
            };
            e.preventDefault();

            message.message = this.state.text.trim();

            if(message.message) {
                message.time = Date.now();

                // send message
                UserActions.createMessage(message);

                // reset the text state
                this.setState({
                    text:''
                });
            }

        }
    },

    /**
     * [_onClick description]
     * Same function _onKeyDown
     */
    _onClick: function(e) {
        var message = {
            message: '',
            time:'',
            id: this.props.userId
        };
        if(this.state.text.trim()) {

            message.time = Date.now();
            message.message = this.state.text.trim();
            UserActions.createMessage(message);

            this.setState({
                text:''
            });
        }
    }

});

module.exports = Composer;
