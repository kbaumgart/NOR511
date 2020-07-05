const moment = require ('moment');
const moment_timezone = require('moment-timezone');

module.exports = {
    PA: function PA(x) {
        moment.tz.setDefault("America/New_York");
        result = moment(x, `YYYY-MM-DD hh:mm:ss`);
        return result.format();},
    NY: function NY(x) {
        moment.tz.setDefault("America/New_York");
        result = moment(x, 'DD/MM/YYYY hh:mm:ss');
        return result.format();
    },
    NJ: function NJ(x) {
        moment.tz.setDefault("America/New_York");
        result = moment(x, 'MM/DD/YYYY h:mm:ss a');
        return result.format();
    },
    NJ2: function NJ2(x) {
        moment.tz.setDefault("America/New_York");
    }
};