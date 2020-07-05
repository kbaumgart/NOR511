//----- required modules
const TimeCorrect = require('./TimeCorrect.js');
const LinkCreator = require('./LinkCreator.js');
const PAcolor = require('../States/PAcolors.json');
const PAcounties = require('../States/PAcounties.json');

module.exports = {
    PAClose: function CloseEmbed(d) {
        var closeEmbedhook = {
            "embed": {
                "title": `${d.Facility} closed due to ${d.EventType}`,
                "url": `https://www.511PA.com/Traffic.aspx?${d.FromLat},${d.FromLong},18z`,
                "color": PAcolor[d.EventType],
                "timestamp": TimeCorrect.PA(d.CreateTime),
                "footer": {
                    //fix the image for here
                    "icon_url": "https://pbs.twimg.com/profile_images/743481571538243585/WX01GtGM_400x400.jpg",
                    "text": `Event ${d.EventID} updated at`
                },
                "author": {
                    "name": "511PA DataFeed",
                    "url": `https://www.511PA.com/Traffic.aspx?${d.FromLat},${d.FromLong},18z`,
                    "icon_url": "https://pbs.twimg.com/profile_images/743481571538243585/WX01GtGM_400x400.jpg"
                },
                "fields": [{
                        "name": "Reason",
                        "value": d.Description
                    },
                    {
                        "name": `From`,
                        "value": `[WME Link](${LinkCreator.WMELink(d.FromLat, d.FromLong)}) | [LiveMap Link](${LinkCreator.LiveMapLink(d.FromLat, d.FromLong)}) | [App Link](${LinkCreator.AppLink(d.FromLat, d.FromLong)})`
                    },
                    {
                        "name": "To",
                        "value": `[WME Link](${LinkCreator.WMELink(d.ToLat, d.ToLong)}) | [LiveMap Link](${LinkCreator.LiveMapLink(d.ToLat, d.ToLong)})  | [App Link](${LinkCreator.AppLink(d.ToLat, d.ToLong)})`
                    },
                    {
                        "name": "Municipality",
                        "value": d.IncidentMuniName,
                        "inline": true
                    },
                    {
                        "name": "County",
                        "value": PAcounties[d.County],
                        "inline": true
                    }

                ]
            }
        };
        return closeEmbedhook;
    },
    PAOpen: function OpenEmbed(d) {
        let openEmbed = {
            "embed": {
                "title": `${d.Facility} was closed due to ${d.EventType}`,
                "color": 1505030,
                "timestamp": TimeCorrect.PA(d.LastUpdate),
                "footer": {
                    //fix the URL for the picture
                    "icon_url": "https://pbs.twimg.com/profile_images/743481571538243585/WX01GtGM_400x400.jpg",
                    "text": `Event ${d.EventID} updated at`
                },
                "author": {
                    "name": "511PA DataFeed",
                    "url": `https://www.511PA.com/Traffic.aspx?${d.FromLat},${d.FromLong},18z`,
                    "icon_url": "https://pbs.twimg.com/profile_images/743481571538243585/WX01GtGM_400x400.jpg"
                },
                "fields": [{
                        "name": "Reason",
                        "value": d.Description
                    },
                    {
                        "name": `From`,
                        "value": `[WME Link](${LinkCreator.WMELink(d.FromLat, d.FromLong)}) | [LiveMap Link](${LinkCreator.LiveMapLink(d.FromLat, d.FromLong)}) | [App Link](${LinkCreator.AppLink(d.FromLat, d.FromLong)})`
                    },
                    {
                        "name": "To",
                        "value": `[WME Link](${LinkCreator.WMELink(d.ToLat, d.ToLong)}) | [LiveMap Link](${LinkCreator.LiveMapLink(d.ToLat, d.ToLong)})  | [App Link](${LinkCreator.AppLink(d.ToLat, d.ToLong)})`
                    },
                    {
                        "name": "Municipality",
                        "value": d.IncidentMuniName,
                        "inline": true
                    },
                    {
                        "name": "County",
                        "value": PAcounties[d.County],
                        "inline": true
                    }
                ]
            }
        };
        return openEmbed;
    },
    NYClose: function ClosureEmbed(d) { //create the embed used to send via the webhook
        var closeEmbedhook = {
            "embed": {
                "title": `${d.RoadwayName} closed due to ${d.EventSubType}`,
                "timestamp": TimeCorrect.NY(d.LastUpdated),
                "footer": {
                    "icon_url": "https://pbs.twimg.com/profile_images/743481571538243585/WX01GtGM_400x400.jpg",
                    "text": `Event ${d.ID} updated at`
                },
                "author": {
                    "name": "511NY DataFeed",
                    "url": `https://511ny.org/?latitude=${d.Latitude}&longitude=${d.Longitude}&zoom=18`,
                    "icon_url": ""
                },
                "fields": [{
                        "name": "Reason",
                        "value": d.Description
                    },
                    {
                        "name": `Links`,
                        "value": `[WME Link](${LinkCreator.WMELink(d.Latitude, d.Longitude)}) | [LiveMap Link](${LinkCreator.LiveMapLink(d.Latitude, d.Longitude)}) | [App Link](${LinkCreator.AppLink(d.Latitude, d.Longitude)})`
                    },
                    {
                        "name": "Municipality",
                        "value": d.FirstArticleCity,
                        "inline": true
                    },
                    {
                        "name": "County",
                        "value": d.CountyName,
                        "inline": true
                    }

                ]
            }
        };
        return closeEmbedhook;
    },
    NYOpen: function OpenEmbed(d) {
        let OpenEmbed = {
            "embed": {
                "title": `${d.RoadwayName} was closed due to ${d.EventSubType}`,
                "timestamp": TimeCorrect.NY(d.LastUpdated),
                "footer": {
                    "icon_url": "https://pbs.twimg.com/profile_images/743481571538243585/WX01GtGM_400x400.jpg",
                    "text": `Event ${d.ID} updated at`
                },
                "author": {
                    "name": "511NY DataFeed",
                    "url": `https://511ny.org/?latitude=${d.Latitude}&longitude=${d.Longitude}&zoom=18`,
                    "icon_url": ""
                },
                "fields": [{
                        "name": "Reason",
                        "value": d.Description
                    },
                    {
                        "name": `Links`,
                        "value": `[WME Link](${LinkCreator.WMELink(d.Latitude, d.Longitude)}) | [LiveMap Link](${LinkCreator.LiveMapLink(d.Latitude, d.Longitude)}) | [App Link](${LinkCreator.AppLink(d.Latitude, d.Longitude)})`
                    },
                    {
                        "name": "Municipality",
                        "value": d.FirstArticleCity,
                        "inline": true
                    },
                    {
                        "name": "County",
                        "value": d.CountyName,
                        "inline": true
                    }

                ]
            }
        };
        return OpenEmbed;
    },
    NJClose: function ClosureEmbed(d) { //create the embed used to send via the webhook
        var closeEmbedhook = {
            "embed": {
                "title": `${d.Facility} closed due to ${d.CategoryName}`,
                "timestamp": TimeCorrect.NJ(d.LastUpdateDate_String),
                "footer": {
                    "icon_url": "https://pbs.twimg.com/profile_images/743481571538243585/WX01GtGM_400x400.jpg",
                    "text": `Event ${d.EventID} updated at`
                },
                "author": {
                    "name": "511NY DataFeed",
                    "url": `https://511ny.org/?latitude=${d.Latitude}&longitude=${d.Longitude}&zoom=18`,
                    "icon_url": ""
                },
                "fields": [{
                        "name": "Reason",
                        "value": d.FullText
                    },
                    {
                        "name": `Links`,
                        "value": `[WME Link](${LinkCreator.WMELink(d.Latitude, d.Longitude)}) | [LiveMap Link](${LinkCreator.LiveMapLink(d.Latitude, d.Longitude)}) | [App Link](${LinkCreator.AppLink(d.Latitude, d.Longitude)})`
                    },
                    {
                        "name": "County",
                        "value": d.County,
                        "inline": true
                    }

                ]
            }
        };
        return closeEmbedhook;
    }
};