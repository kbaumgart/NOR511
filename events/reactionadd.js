const sql = require('../Workers/DB.js');
const returndata = require ('../Workers/returndata.js');

module.exports = {
    associateID: function update (reaction) {
        if (reaction.message.author == reaction.client.user.id) {
            console.log('Reaction added to database');
        sql.db.run(`INSERT INTO CLOSURE (MessageID, UserID, Channel, Guild, Timestamp) VALUES (?, ?, ?, ?, ?)`, returndata.Closure(reaction));
    }}
};