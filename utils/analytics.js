const CryptedJSONdb = require("cryptedjsondb");
const schedule = require("node-schedule");

const database = new CryptedJSONdb("./utils/analytics.json", {
    encryption: false,
    key: stealth.env.databaseKey,
    minify: false
});

const maxLength = 14;

function addAnalytic(name) {
    const currentTimestamp = Date.now();

    const analyticsData = database.getValue("analytics") || { [name]: [] };
    const previousScore = analyticsData[name].length > 0 ? analyticsData[name][analyticsData[name].length - 1].score : 0;
    const newScore = previousScore + 1;

    analyticsData[name].push({ "time": currentTimestamp, "score": newScore });

    if(analyticsData[name].length > maxLength) analyticsData[name].shift();

    database.data["analytics"] = analyticsData;
};

function collectAnalytics(name) {
    const analyticsData = database.getValue("analytics") || { [name]: [] };

    database.data["analytics"] = analyticsData;
    database.save();
};

function get_analytics() {
    return database.data.analytics;
};

schedule.scheduleJob({ hour: 12, minute: 0, second: 0 }, () => collectAnalytics("messages"));
schedule.scheduleJob({ hour: 12, minute: 0, second: 0 }, () => collectAnalytics("apiusage"));
schedule.scheduleJob({ hour: 12, minute: 0, second: 0 }, () => collectAnalytics("popularity"));

stealth.events.on("message", () => addAnalytic("messages"));
stealth.events.on("apireq", () => addAnalytic("apiusage"));
stealth.events.on("pagereq", () => addAnalytic("popularity"));

module.exports = { get_analytics };