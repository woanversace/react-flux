var React = require('react'),
    ReactPropTypes = React.PropTypes;

var UserName = React.createClass({

    propTypes: {
        userName: ReactPropTypes.string.isRequired,
        position: ReactPropTypes.string.isRequired,
        id: ReactPropTypes.string.isRequired
    },

    render: function() {
        var userName = this.props.userName,
            id = this.props.id,
            position = this.props.position,
            userNameHTML;

    if(position === 'left-pane') {
        userNameHTML =
            <h5 className="media-heading" key={id}>
                {userName}
            </h5>;


    } else if(position === 'rightPane') {
        // TOOD: add when render username not at left
    }

    return (
        userNameHTML
        // <div>{userNameHTML}</div>
    );
  }

});

module.exports = UserName;
