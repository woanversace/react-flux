var React = require('react'),
    ReactPropTypes = React.PropTypes;

/**
 * [render description]
 * It only use to render an avatar
 */
var Avatar = React.createClass({

  propsTypes: {
    imgUrl: ReactPropTypes.string.isRequired,
    id: ReactPropTypes.string.isRequired
  },

  render: function() {
    var id = this.props.id;
    var imgUrl = this.props.imgUrl;

    return (
      <img
        className="media-object"
        src={imgUrl}
        key={id}
      />
    );
  }

});

module.exports = Avatar;
