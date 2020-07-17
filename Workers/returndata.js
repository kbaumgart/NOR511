const TimeCorrect = require('./TimeCorrect.js');
const config = require('../config.json');

module.exports = {
    PA: function returnData(y) { //format a comma seperated return for insertion into the sql database of relevent datapoints
        return [y.EventID, y.Facility, y.LaneStatus, y.Description, y.EventType, config.PA.Counties[y.County], y.IncidentMuniName, y.FromLat, y.FromLong, y.ToLat, y.ToLong, TimeCorrect.PA(y.DateTimeNotified), TimeCorrect.PA(y.CreateTime), TimeCorrect.PA(y.LastUpdate), y.DetourInEffect, TimeCorrect.PA(y.ActualDateTimeOpened), ""];
    },
    NY: function returnData(y) { //format a comma seperated return for insertion into the sql database of relevent datapoints
        return [y.ID, y.RoadwayName, y.Latitude, y.Longitude, y.RegionName, y.CountyName, y.DirectionOfTravel, y.Description, y.Location, y.LanesAffected, y.LanesStatus, y.FirstArticleCity, y.SecondCity, y.EventType, y.EventSubType, TimeCorrect.NY(y.LastUpdated), TimeCorrect.NY(y.Reported), TimeCorrect.NY(y.StartDate), TimeCorrect.NY(y.PlannedEndDate), ""];
    },
    NJ: function returnNJData(x) {
        return [x.EventID, x.Facility, x.State, x.Latitude, x.Longitude, x.ToLatitude, x.ToLongitude, x.FullText, TimeCorrect.NJ(x.LastUpdateDate_String), x.County, x.Direction, x.Notes, (x.StartDateTime), x.CategoryName, x.EndDate_String, ""];
    },
    AdvisoryDE: function returnData(y) { //format a comma seperated return for insertion into the sql database of relevent datapoints
        return [y.id, y.where.location, y.timestamp, y.EventType, y.type.name, y.published.linkbackUrl, "", y.where.lat, y.where.lon, y.where.address.address1, y.where.county.name];
    },
    ScheduleDE: function returnData(y) { //format a comma seperated return for insertion into the sql database of relevent datapoints
        return [y.strId, y.construction, y.startDate, y.EventType, y.releaseId, "", y.latitude, y.longitude, y.title, y.county];
    },
    Closure: function returnData(x, y) {
        return [x.message.id, x.users.cache.lastKey(), x.message.channel.id, x.message.guild.id, new Date(), y];
    }
};