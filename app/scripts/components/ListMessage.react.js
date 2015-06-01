'user strict';


var React = require('react'),
    _ = require('underscore'),
    ReactPropTypes = React.PropTypes;

/**
 * [ListMessage description]
 * This view get Props form SectionMessage
 * It get userTarget and listMessage
 */
var ListMessage = React.createClass({

    /**
     * [propTypes description]
     * @type {Object}
     */
    propTypes: {
        userTarget: ReactPropTypes.object,
        listMessage: ReactPropTypes.array
    },

    render: function() {
        if(this.props.listMessage) {

            // sort this listMessage by time
            var listMessage = _.sortBy(
                    this.props.listMessage,
                    function(message) {
                        return message.time;
                    }
                ),

                userTarget = this.props.userTarget,
                contentHtml=[];

            for (var i in listMessage) {

                // Check if Message of userTarget it will pull to left
                if(listMessage[i].id === userTarget.id) {

                    contentHtml.push(
                        <li key={listMessage.key}
                            className="pull-left info item-message">
                            <p className="text-left">
                                {listMessage[i].message}
                            </p>
                        </li>
                    );

                } else {

                    contentHtml.push(
                        <li key={listMessage.key}
                            className="pull-right info item-message">
                            <p className="text-right">
                                {listMessage[i].message}
                            </p>
                        </li>
                    );
                }
            }
        }

        return (
            <ul className="list-unstyled clearfix">{contentHtml}</ul>
        );
    }

});

module.exports = ListMessage;
