import { connectionInstance } from "./client.js";
import { parseCookies } from "./util.js";
import config from "./config.js";

const cookies = parseCookies();

window.StealthNet = {
    config,
    cookie: cookies,
    connection: connectionInstance
}

// init config
const messageGroupSpace = config.getValue("space-between-messages");

Object.values(document.styleSheets[0].cssRules).filter(rule => rule.selectorText == ".message-container")[0].style.marginBottom = messageGroupSpace;