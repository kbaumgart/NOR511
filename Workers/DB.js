const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./511.db');
module.exports = { db };

db.run("CREATE TABLE IF NOT EXISTS PA (EventID INTEGER, Facility TEXT, LaneStatus TEXT, Description TEXT, EventType TEXT, County INTEGER, IncidentMuniName TEXT, FromLat INTEGER, FromLong INTEGER, ToLat INTEGER, ToLong INTEGER, DateTimeNotified TEXT, CreateTime TEXT, LastUpdate TEXT, DetourInEffect TEXT, ActualDateTimeOpened TEXT, MessageID INTEGER)");
db.run("CREATE TABLE IF NOT EXISTS NJ (ID Text, RoadwayName TEXT, EventState INTEGER, Latitude INTEGER, Longitude INTEGER, ToLatitude INTEGER, ToLongitude INTEGER, Description TEXT, LastUpdate TEXT, County TEXT, Direction TEXT, Notes TEXT, StartDate TEXT, CategoryName TEXT, EndDate TEXT, MessageID INTEGER)");
db.run("CREATE TABLE IF NOT EXISTS NY (ID Text, RoadwayName TEXT, Latitude INTEGER, Longitude INTEGER, RegionName TEXT, County TEXT, Direction TEXT, Description TEXT, Location TEXT, LanesAffected TEXT, LanesStatus TEXT, FirstArticleCity TEXT, SecondCity TEXT, EventType TEXT, EventSubType TEXT, LastUpdated TEXT, Reported TEXT, StartDate TEXT, PlannedEndDate TEXT, MessageID INTEGER)");
db.run("CREATE TABLE IF NOT EXISTS CLOSURE (MessageID INTEGER, UserID INTEGER, Channel INTEGER, Guild INTEGER, Timestamp TEXT)");
db.run("CREATE TABLE IF NOT EXISTS DE (eventID TEXT, title TEXT, desc TEXT, timestamp TEXT, starttime TEXT, endtime TEXT, status TEXT, link TEXT, posted TEXT, lat TEXT, long TEXT, address TEXT, type TEXT, wherename TEXT);");
db.run("CREATE TABLE IF NOT EXISTS errlog (timestamp TEXT, err TEXT);");