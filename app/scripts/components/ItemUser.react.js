'use strict';


var React = require('react'),
    ReactPropTypes = React.PropTypes,

    UserName = require('./UserName.react'),
    Avatar = require('./Avatar.react'),
    UserActions = require('../actions/UserActions'),

    _ = require('underscore');

var ItemUser = React.createClass({

    propTypes: {
        currentUserId: ReactPropTypes.string.isRequired,
        userName: ReactPropTypes.string.isRequired,
        imgUrl: ReactPropTypes.string.isRequired,
        id: ReactPropTypes.string.isRequired,

        // This is a prop will use for reuse this view
        position: ReactPropTypes.string.isRequired
    },


    render: function() {

        return (
            <li className="media"
                key={this.props.id}
                onClick={this._onClick}
            >
                <div className="media-left">
                    <a href="#">
                        <Avatar
                            imgUrl={this.props.imgUrl}
                            id={this.props.id} />
                    </a>
                </div>
                <div className="media-body what">
                    <UserName
                        userName={this.props.userName}
                        id={this.props.id}
                        position={this.props.position} />
                </div>
            </li>
        );
    },


    _hasClass: function(element, className) {
        return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
    },


    /**
     * _onClick This function send a payload to actionCreator,
     * Remove class actived on other element, add for current taget.
     *
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onClick: function(e) {
        var self = this,

            // set playload
            user = {
                imgUrl: this.props.imgUrl,
                userName: this.props.userName,
                id: this.props.id
            },

            currentUserId = this.props.currentUserId,

            // get Element
            element = e.currentTarget,
            hasClass = this._hasClass(element, 'activated');

        if (!hasClass) {
            var children = element.parentElement.children;

            // remove class 'activated' in current element
            _.each(children, function(child) {
                if (self._hasClass(child, 'activated')) {
                    child.classList.remove('activated');
                }
            });

            // add class activated
            element.classList.add('activated');

            // call Action and parse payload
            UserActions.clickToChat(user, currentUserId);
        }
    }

});

module.exports = ItemUser;
