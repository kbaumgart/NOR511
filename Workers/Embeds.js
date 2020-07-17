//----- required modules
const TimeCorrect = require('./TimeCorrect.js');
const LinkCreator = require('./LinkCreator.js');
const config = require('../config.json');

module.exports = {
    PAClose: function CloseEmbed(d) {
        var closeEmbedhook = {
            "embed": {
                "title": `${d.Facility} closed due to ${d.EventType}`,
                "url": `https://www.511PA.com/Traffic.aspx?${d.FromLat},${d.FromLong},18z`,
                "color": config.PA.Colors[d.EventType],
                "timestamp": TimeCorrect.PA(d.CreateTime),
                "footer": {
                    //fix the image for here
                    "icon_url": "https://www.511pa.com/images/511PA_app_logo.png",
                    "text": `Event ${d.EventID} updated at`
                },
                "author": {
                    "name": "511PA DataFeed",
                    "url": `https://www.511PA.com/Traffic.aspx?${d.FromLat},${d.FromLong},18z`,
                    "icon_url": "https://www.511pa.com/images/511PA_app_logo.png"
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
                        "value": config.PA.Counties[d.County],
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
                "url": `https://www.511PA.com/Traffic.aspx?${d.FromLat},${d.FromLong},18z`,
                "color": 1505030,
                "timestamp": TimeCorrect.PA(d.LastUpdate),
                "footer": {
                    //fix the URL for the picture
                    "icon_url": "https://www.511pa.com/images/511PA_app_logo.png",
                    "text": `Event ${d.EventID} updated at`
                },
                "author": {
                    "name": "511PA DataFeed",
                    "url": `https://www.511PA.com/Traffic.aspx?${d.FromLat},${d.FromLong},18z`,
                    "icon_url": "https://www.511pa.com/images/511PA_app_logo.png"
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
                        "value": config.PA.Counties[d.County],
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
                "color": config.NY.Colors[d.EventSubType],
                "url": `https://511ny.org/?latitude=${d.Latitude}&longitude=${d.Longitude}&zoom=18`,
                "timestamp": TimeCorrect.NY(d.LastUpdated),
                "footer": {
                    "icon_url": "https://511ny.org/Content/NY/images/favicon/favicon-192.png",
                    "text": `Event ${d.ID} updated at`
                },
                "author": {
                    "name": "511NY DataFeed",
                    "url": `https://511ny.org/?latitude=${d.Latitude}&longitude=${d.Longitude}&zoom=18`,
                    "icon_url": "https://511ny.org/Content/NY/images/favicon/favicon-192.png"
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
                "url": `https://511ny.org/?latitude=${d.Latitude}&longitude=${d.Longitude}&zoom=18`,
                "color": 1505030,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": "https://511ny.org/Content/NY/images/favicon/favicon-192.png",
                    "text": `Event ${d.EventID} updated at`
                },
                "author": {
                    "name": "511NY DataFeed",
                    "url": `https://511ny.org/?latitude=${d.Latitude}&longitude=${d.Longitude}&zoom=18`,
                    "icon_url": "https://511ny.org/Content/NY/images/favicon/favicon-192.png"
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
        if ((d.UserID) && (d.OpenFlag == 1)) { OpenEmbed.content = `Event marked closed by <@${d.UserID}>`; }
        return OpenEmbed;
    },
    NJClose: function ClosureEmbed(d) { //create the embed used to send via the webhook
        var closeEmbedhook = {
            "embed": {
                "title": `${d.Facility} closed due to ${d.CategoryName}`,
                "timestamp": TimeCorrect.NJ(d.LastUpdateDate_String),
                "color": config.NJ.Colors[d.CategoryName],
                "footer": {
                    "icon_url": "https://www.511nj.org/images/logo.png",
                    "text": `Event ${d.EventID} updated at`
                },
                "author": {
                    "name": "511NY DataFeed",
                    "url": ``,
                    "icon_url": "https://www.511nj.org/images/logo.png"
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
    },
    NJOpen: function OpenEmbed(d) { //create the embed used to send via the webhook
            var OpenEmbed = {
                "embed": {
                    "title": `${d.RoadwayName} reopened after ${d.CategoryName}`,
                    "color": 1505030,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": "https://www.511nj.org/images/logo.png",
                        "text": `Event ${d.EventID} updated at`
                    },
                    "author": {
                        "name": "511NY DataFeed",
                        "url": ``,
                        "icon_url": "https://www.511nj.org/images/logo.png"
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
                            "name": "County",
                            "value": d.County,
                            "inline": true
                        }
    
                    ]
                }
            };
            if ((d.UserID) && (d.OpenFlag == 1))  { 
                OpenEmbed.content = `Event marked closed by <@${d.UserID}>`;}
            return OpenEmbed;
        },
        DEAdvisoryClose: function CloseEmbed(d) {
            let colorcode;
            let location;
            if (d.where.address.address1 != null) {
                  location = d.where.address.address1;
            } else { 
                   location = d.where.county.name; 
            }
            if (d.type.name == "Construction") {
                  colorcode = "0xFF6B00";
            } else {
                  colorcode = "0xFF0000";
            }
              var closeembed = {
                  "embed": {
                      color: colorcode,
                      title: `${d.type.name} near ${location}`,
                      url: d.published.linkbackUrl,
                      author: {
                          name: 'DelDot DataFeed (Advisory Closure)',
                          icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
                          url: 'https://deldot.gov',
                      },
                      //description: row.desc,
                      thumbnail: {
                          url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
                      },
                      fields: [
                          {
                              name: 'Reason',
                              value: d.where.location,
                          },
                          {
                              name: 'Location',
                              value: `[WME Link](${LinkCreator.WMELink(d.where.lat, d.where.lon)}) | [Livemap Link](${LinkCreator.LiveMapLink(d.where.lat, d.where.lon)}) | [App Link](${LinkCreator.AppLink(d.where.lat, d.where.lon)})`,
                          },
                      ],
                      timestamp: new Date(d.timestamp).toLocaleString(),
                      footer: {
                          text: "Event " + d.id + " updated at ",
                      },
                  }
              };
              return closeembed;
          },
          DEAdvisoryOpen: function OpenEmbed(d) {
              let location;
              let colorcode;
            if (d.Address != null) {
                  location = d.Address;
            } else { 
                  location = d.County; 
            }
            if (d.AdvisoryType == "Construction") {
                  colorcode = "0xFF6B00";
            } else {
                  colorcode = "0xFF0000";
            }
              var openembed = {
                  "embed": {
                      color: 0x00ff00,
                      title: `Cleared! - ${d.EventType} near ${location}`,
                      url: d.Link,
                      author: {
                          name: 'DelDot DataFeed (Advisory Closure)',
                          icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
                          url: 'https://deldot.gov',
                      },
                      //description: row.desc,
                      thumbnail: {
                          url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
                      },
                      fields: [
                          {
                              name: 'Reason',
                              value: d.Desc.replace("IS CLOSED","*was* CLOSED"),
                          },
                          {
                              name: 'Location',
                              value: `[WME Link](${LinkCreator.WMELink(d.Lat, d.Lon)}) | [Livemap Link](${LinkCreator.LiveMapLink(d.Lat, d.Lon)}) | [App Link](${LinkCreator.AppLink(d.Lat, d.Lon)})`,
                          },
                      ],
                      timestamp: new Date().toLocaleString(),
                      footer: {
                          text: `Event ${d.EventID} updated at`,
                      },
                  }
              };
              if ((d.UserID) && (d.OpenFlag == 1))  { openembed.content = `Event marked closed by <@${d.UserID}>`; }
              return openembed;
          },
          DEScheduleClose: function CloseEmbed(d) {
              var closeembed = {
                  "embed": {
                      color: 0xffff00,
                      title: d.title,
                      url: `https://deldot.gov/About/news/index.shtml?dc=release&id=${d.releaseId}`,
                      author: {
                          name: 'DelDot DataFeed (Scheduled Closure)',
                          icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
                          url: 'https://deldot.gov',
                      },
                      thumbnail: {
                          url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
                      },
                      fields: [
                          {
                              name: 'Reason',
                              value: d.construction,
                          },
                          {
                              name: 'Location',
                              value: `[WME Link](${LinkCreator.WMELink(d.latitude, d.longitude)}) | [Livemap Link](${LinkCreator.LiveMapLink(d.latitude, d.longitude)}) | [App Link](${LinkCreator.AppLink(d.latitude, d.longitude)})`,
                          },
                         {
                              name: 'Dates',
                              value: d.startDate,
                          },
                          {
                              name: 'County',
                              value: d.county,
                          },
                      ],
                      timestamp: new Date(d.timestamp).toLocaleString(),
                      footer: {
                          text: "Scheduled Closure " + d.strId,
                      },
                  }
              };
              return closeembed;
          },
          DEScheduleOpen: function OpenEmbed(d) {
              var openembed = {
                  "embed": {
                      color: 0x00ff00,
                      title: d.Address,
                      url: `https://deldot.gov/About/news/index.shtml?dc=release&id=${d.Link}`,
                      author: {
                          name: 'DelDot DataFeed (Scheduled Closure)',
                          icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
                          url: 'https://deldot.gov',
                      },
                      thumbnail: {
                          url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
                      },
                      fields: [
                          {
                              name: 'Reason',
                              value: d.Desc,
                          },
                          {
                              name: 'Location',
                              value: `[WME Link](${LinkCreator.WMELink(d.Lat, d.Lon)}) | [Livemap Link](${LinkCreator.LiveMapLink(d.Lat, d.Lon)}) | [App Link](${LinkCreator.AppLink(d.Lat, d.Lon)})`,
                          },
                         {
                              name: 'Dates',
                              value: d.TimeStamp,
                          },
                          {
                              name: 'County',
                              value: d.County.replace(" County",""),
                          },
                      ],
                      timestamp: new Date(),
                      footer: {
                          text: `Scheduled Closure ${d.EventID} cleared at `
                      },
                  }
              };
              if ((d.UserID) && (d.OpenFlag == 1))  { openembed.content = `Event marked closed by <@${d.UserID}>`; }
              return openembed;
          }
    
};