var keyMirror = require('keymirror');

module.exports = {

    UserActionTypes: keyMirror({
        UPDATE_LIST_USER: null,
        CLICK_TO_CHAT: null,
        LOGIN_USER: null,
        LISTEN_NEW_MESSAGE: null,
        OFF_LISTEN_NEW_MESSAGE: null,
        CREATE_USER: null,
        UPDATE_LIST_MESSAGE: null,
        UPDATE_USER_TARGET: null,
        CREATE_MESSAGE: null
    })
};
