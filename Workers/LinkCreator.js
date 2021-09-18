const fetch = require('node-fetch');

module.exports = {
    LiveMapLink: function LiveMapLink(lat, lon) {
        var lmlink = `https://www.waze.com/livemap?lon=${lon}&lat=${lat}&zoom=17`;
        return lmlink;
    },
    AppLink: function applink(lat, lon) {
        var wazelink = `https://www.waze.com/ul?ll=${lat},${lon}`;
        return wazelink;
    },
    WMELink: function WMELink(lat, lon) {
        var wmelink = `https://www.waze.com/en-US/editor/?env=usa&lon=${lon}&lat=${lat}&zoomLevel=16&marker=true`;
        return wmelink;

    }
};