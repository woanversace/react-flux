var React = require('react'),
    ReactPropTypes = React.PropTypes,
    UserStore = require('../stores/UserStore'),
    ListMessage = require('./ListMessage.react'),
    ItemUser = require('./ItemUser.react'),
    Composer = require('./Composer.react'),
    MessageStore = require('../stores/MessageStore'),

    _ = require('underscore');

var getStateMessage = function() {
    return {
        userTarget: UserStore.getUserTarget() || null,
        listMessage: MessageStore.getListMessage() || null
    };
};


var ChatPane = React.createClass({

    propTypes: {
        user: ReactPropTypes.object,
        listUser: ReactPropTypes.array
    },

    getInitialState: function() {
        return getStateMessage();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        MessageStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
        MessageStore.removeChangeListener(this._onChange);
    },

    render: function() {

        var listUserHTML = [],
            messageSession,
            user = this.props.user,
            listUser = this.props.listUser,
            userTarget = this.state.userTarget,
            listMessage = this.state.listMessage || [];

        if (listUser && listUser.length) {
            listUser = _.reject(listUser, function(item) {
                return item.id === user.id;
            });

            for (var i in listUser) {
                listUserHTML.push(
                    <ItemUser
                        currentUserId={user.id}
                        key={listUser[i].id}
                        position="left-pane"
                        id={listUser[i].id}
                        userName={listUser[i].userName}
                        imgUrl={listUser[i].imgUrl} />
                )
            }

        }

        if (userTarget) {
            messageSession =
                <div className="section-message">
                    <div className="message-section">
                        <div><ListMessage
                                listMessage={listMessage}
                                userTarget={userTarget}
                            /></div>
                    </div>
                    <div className="compose-section">
                        <div className="wrapper-composer">
                            <Composer
                                userId={user.id}
                                userTarget={userTarget}/>
                        </div>
                    </div>
                </div>
        } else {
            messageSession =
                <h3> CHOSE USER TO CHAT</h3>
        }

        return (

            <div className="chat-content clearfix">
                <div className="list-user pull-left col-md-5 col-xs-5 col-sm-5">
                    <ul>{listUserHTML}</ul>
                </div>
                <div className="message pull-left col-md-7 col-xs-7 col-sm-7">
                    {messageSession}
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getStateMessage());
    }

});

module.exports = ChatPane;
