const moment = require('moment');

function formatMessage(username, text) {
    return {
        username: username,
        text: text,
        time: moment().utcOffset("+05:30").format('h:mm a')

    };
}
module.exports = formatMessage;