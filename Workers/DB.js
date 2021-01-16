const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./511.db');
module.exports = { db };


//different tables that are needed - these are used only to determine whether or not to send a message, particularly if the bot goes down
db.run("CREATE TABLE IF NOT EXISTS PA (EventID INTEGER, Facility TEXT, LaneStatus TEXT, Description TEXT, EventType TEXT, County INTEGER, IncidentMuniName TEXT, FromLat INTEGER, FromLong INTEGER, ToLat INTEGER, ToLong INTEGER, DateTimeNotified TEXT, CreateTime TEXT, LastUpdate TEXT, DetourInEffect TEXT, ActualDateTimeOpened TEXT, MessageID INTEGER)");
db.run("CREATE TABLE IF NOT EXISTS NJ (EventID Text, RoadwayName TEXT, State TEXT, Latitude INTEGER, Longitude INTEGER, ToLatitude INTEGER, ToLongitude INTEGER, Description TEXT, LastUpdate TEXT, County TEXT, Direction TEXT, Notes TEXT, StartDate TEXT, CategoryName TEXT, EndDate TEXT, MessageID INTEGER)");
db.run("CREATE TABLE IF NOT EXISTS NY (ID Text, RoadwayName TEXT, Latitude INTEGER, Longitude INTEGER, RegionName TEXT, County TEXT, Direction TEXT, Description TEXT, Location TEXT, LanesAffected TEXT, LanesStatus TEXT, FirstArticleCity TEXT, SecondCity TEXT, EventType TEXT, EventSubType TEXT, LastUpdated TEXT, Reported TEXT, StartDate TEXT, PlannedEndDate TEXT, MessageID INTEGER)");
db.run("CREATE TABLE IF NOT EXISTS DE (EventID TEXT, Desc TEXT, TimeStamp TEXT, EventType TEXT, AdvisoryType TEXT, Link TEXT, MessageID TEXT, Lat TEXT, Lon TEXT, Address TEXT, County TEXT)");
//need to review the above 4 - do we need all those columns?

//this table logs all the emoji reactions, OpenFlag indicates whether or not  roadway is still open, Notification is whether it is scheduled by a user in advance or scheduled by Waze
db.run("CREATE TABLE IF NOT EXISTS CLOSURE (MessageID INTEGER, UserID INTEGER, Channel INTEGER, Guild INTEGER, ReactionTimestamp TEXT, OpenFlag INTEGER, Notification INTEGER)");
//this table logs all the closures sent to the respective channels along with some simple details - these 2 can be joined for reporting purposes
db.run("CREATE TABLE IF NOT EXISTS EVENTS (MessageID INTEGER State TEXT EventID TEXT Roadway TEXT County TEXT Description TEXT EventTimeStamp TEXT)");
//it is what it says it is, an error log
db.run("CREATE TABLE IF NOT EXISTS errlog (timestamp TEXT, err TEXT)");