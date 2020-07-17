const sql = require('../Workers/DB.js');
const returndata = require ('../Workers/returndata.js');

module.exports = {
    associateID: function update (reaction, flag) {
        if (reaction.message.author == reaction.client.user.id) {
            console.log('Reaction added to database');
        sql.db.run(`INSERT INTO CLOSURE (MessageID, UserID, Channel, Guild, Timestamp, OpenFlag) VALUES (?, ?, ?, ?, ?, ?)`, returndata.Closure(reaction, flag));
    }}
};