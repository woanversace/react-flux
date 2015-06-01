var React = require('react'),
    UserStore = require('../stores/UserStore'),
    UserActions = require('../actions/UserActions'),

    ChatPane = require('./ChatPane.react'),

    Faker = require('faker');


var KEY_CODE = 13;

var ChatApp = React.createClass({

    getInitialState: function() {
        return {
            text: '',
            user: UserStore.getUser() || null,
            listUser: UserStore.getListUser() || null
        };
    },

    componentDidMount: function() {
        //After render we need get list user
        UserActions.updateListUser();
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    render: function() {

        var listUser = this.state.listUser,
            user = this.state.user,
            listHTML = [],
            contentHtml;

        if(!user) {

            if(listUser && listUser.length) {
                for(var i in listUser) {

                    listHTML.push(
                        <li key={listUser[i].id}
                            data-in-list={i}
                            onClick={this._onClickLogin}>
                            {listUser[i].userName}
                        </li>
                    )
                }
            }

            contentHTML =
                <div className="bs-form row">
                    <div>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pick A Name"
                                value={this.state.text}
                                aria-describedby="basic-addon2"
                                onChange={this._onChangeInput}
                                onKeyDown={this._onKeyDown}
                            />
                            <span className="input-group-btn">
                                <button
                                    className="btn btn-default"
                                    type="button"
                                    onClick={this._randomName}
                                >
                                    Random name!</button>
                            </span>
                            <span className="input-group-btn">
                                <button
                                    className="btn btn-default"
                                    type="button"
                                    onClick={this._onClick}
                                >
                                    Go!
                                </button>
                            </span>
                        </div>
                    </div>
                    <div className="list-user">
                        Or click item to Login:
                        <ul>{listHTML}</ul>
                    </div>
                </div>;

        } else {
            contentHTML =
                <ChatPane
                    listUser={listUser}
                    user={user}
                    />
        }

        return (
            contentHTML
        );
    },

    _onChange: function() {
        this.setState({
            user: UserStore.getUser(),
            listUser: UserStore.getListUser()
        });
    },

    _onChangeInput: function(e) {
        var val = e.currentTarget.value.trim();
        if (val) {
            this.setState({
                text: val
            });
        }
    },

    _onKeyDown: function(e) {
        if(e.keyCode === KEY_CODE) {
            e.preventDefault();

            var text = this.state.text.trim(),
                imgUrl = Faker.internet.avatar();

            if(text) {
                UserAction.createUser(text, imgUrl);
                this.setState({
                    text:''
                });
            }
        }
    },

    _randomName: function(e) {
        this.setState({
            text: Faker.name.findName()
        });
    },

    _onClick: function() {
        var text = this.state.text.trim();
        var imgUrl = Faker.internet.avatar();
        if(text) {
            UserActions.createUser(text, imgUrl);
            this.setState({
                text:''
            });
        }
    },

    _onClickLogin: function(e) {
        var element = e.currentTarget,
            position = element.getAttribute('data-in-list'),
            user = this.state.listUser[position];

        UserActions.login(user);
    }

});

module.exports = ChatApp;
