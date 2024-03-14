/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./webpack/admin/frontend.js":
/*!***********************************!*\
  !*** ./webpack/admin/frontend.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   formatTimestamp: () => (/* binding */ formatTimestamp),\n/* harmony export */   getData: () => (/* binding */ getData),\n/* harmony export */   getDayOfMonth: () => (/* binding */ getDayOfMonth),\n/* harmony export */   getFormattedDates: () => (/* binding */ getFormattedDates),\n/* harmony export */   getScore: () => (/* binding */ getScore)\n/* harmony export */ });\nasync function getData(url) {\r\n    return new Promise((resolve, reject) => {\r\n        var xhr = new XMLHttpRequest();\r\n\r\n        xhr.open(\"GET\", url, true);\r\n\r\n        xhr.onload = () => {\r\n            if(xhr.status >= 200 && xhr.status < 300) {\r\n                let jsonResponse;\r\n\r\n                try {\r\n                    jsonResponse = JSON.parse(xhr.responseText);\r\n                } catch(error) {\r\n                    resolve(xhr.responseText);\r\n                    return;\r\n                }\r\n\r\n                resolve(jsonResponse);\r\n            } else {\r\n                reject(new Error(`HTTP Error: ${xhr.status}`));\r\n            }\r\n        }\r\n\r\n        xhr.onerror = () => {\r\n            reject(new Error('Network request failed'));\r\n        }\r\n\r\n        xhr.send();\r\n    });\r\n}\r\n\r\nfunction getFormattedDates(chartData) {\r\n    return chartData.map(timestamp => {\r\n        const date = new Date(timestamp.time);\r\n        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);\r\n    });\r\n}\r\n\r\nfunction getDayOfMonth(chartData) {\r\n    return chartData.map(timestamp => {\r\n        const date = new Date(timestamp.time);\r\n        return date.getDate();\r\n    });\r\n}\r\n\r\nfunction getScore(chartData) {\r\n    return chartData.map(timestamp => {\r\n        return timestamp.score;\r\n    });\r\n}\r\n\r\nfunction formatTimestamp(timestamp) {\r\n    const date = new Date(timestamp);\r\n  \r\n    const year = date.getFullYear();\r\n    const month = String(date.getMonth() + 1).padStart(2, '0');\r\n    const day = String(date.getDate()).padStart(2, '0');\r\n    \r\n    const hours = String(date.getHours()).padStart(2, '0');\r\n    const minutes = String(date.getMinutes()).padStart(2, '0');\r\n    const seconds = String(date.getSeconds()).padStart(2, '0');\r\n  \r\n    return `[${year}-${month}-${day}] ${hours}:${minutes}:${seconds}`;\r\n}\n\n//# sourceURL=webpack://stealthnet-server/./webpack/admin/frontend.js?");

/***/ }),

/***/ "./webpack/admin/getDashboard.js":
/*!***************************************!*\
  !*** ./webpack/admin/getDashboard.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _frontend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./frontend.js */ \"./webpack/admin/frontend.js\");\n\r\n\r\nconst dashboardCharts = document.querySelectorAll(\".chartlist > *[apiname]\");\r\n\r\ndashboardCharts.forEach(async chartElement => {\r\n    var chart = echarts.init(chartElement);\r\n\r\n    const response = ((await (0,_frontend_js__WEBPACK_IMPORTED_MODULE_0__.getData)(\"/admin-api/v1/get-analytics\"))[chartElement.getAttribute(\"apiname\")]);\r\n\r\n    if(!response) return;\r\n\r\n    const chartData = {\r\n        xData: getFormattedDates(response),\r\n        yData: getScore(response)\r\n    }\r\n\r\n    chart.setOption({\r\n        title: {\r\n            text: chartElement.getAttribute(\"name\"),\r\n            textStyle: {\r\n                color: \"#8B91C3\"\r\n            }\r\n        },\r\n        backgroundColor: \"#1D1D2F\",\r\n        xAxis: {\r\n            data: chartData.xData,\r\n            axisLine: {\r\n                lineStyle: {\r\n                    color: \"#8B91C3\"\r\n                }\r\n            }\r\n        },\r\n        yAxis: {\r\n            axisLine: {\r\n                lineStyle: {\r\n                    color: \"#8B91C3\"\r\n                }\r\n            }\r\n        },\r\n        series: [{\r\n            type: \"line\",\r\n            data: chartData.yData,\r\n            lineStyle: {\r\n                color: \"#9EA4D6\"\r\n            },\r\n            itemStyle: {\r\n                color: \"#AAB1EC\"\r\n            },\r\n            symbol: \"circle\",\r\n            symbolSize: 8 \r\n        }]\r\n    });\r\n});\n\n//# sourceURL=webpack://stealthnet-server/./webpack/admin/getDashboard.js?");

/***/ }),

/***/ "./webpack/admin/index.js":
/*!********************************!*\
  !*** ./webpack/admin/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _getDashboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDashboard.js */ \"./webpack/admin/getDashboard.js\");\n/* harmony import */ var _frontend_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./frontend.js */ \"./webpack/admin/frontend.js\");\n\r\n\r\n\r\n\r\ndocument.getElementById(\"user-search\").addEventListener(\"keydown\", async event => {\r\n    if(event.key == \"Enter\" && document.getElementById(\"user-search\").value.trim() !== '') {\r\n        const userData = await (0,_frontend_js__WEBPACK_IMPORTED_MODULE_1__.getData)(\"/admin-api/v1/get-user/\" + document.getElementById(\"user-search\").value);\r\n        document.getElementById(\"user-search\").value = '';\r\n\r\n        // Display the user data\r\n        document.getElementById(\"user-pfp\").src = userData.pfpURL;\r\n        document.getElementById(\"user-username\").innerText = userData.username\r\n        document.getElementById(\"user-creationtime\").innerText = (0,_frontend_js__WEBPACK_IMPORTED_MODULE_1__.formatTimestamp)(userData.creationTime);\r\n\r\n        // Special properties\r\n        document.getElementById(\"user-prop-id\").innerText = userData.id;\r\n        document.getElementById(\"user-prop-displayname\").innerText = userData.display_name;\r\n        document.getElementById(\"user-prop-email\").innerText = userData.email;\r\n        document.getElementById(\"user-prop-token\").innerText = userData.token;\r\n\r\n        const friendsTable = document.getElementById(\"user-friends\");\r\n\r\n        // Load friends\r\n        // Clear previous entries\r\n        while(friendsTable.rows.length > 1) {\r\n            friendsTable.deleteRow(1);\r\n        }\r\n        if(userData.friends && userData.friends.length > 0) {\r\n            userData.friends.forEach(async _friend => {\r\n                const friendData = await (0,_frontend_js__WEBPACK_IMPORTED_MODULE_1__.getData)(\"/admin-api/v1/get-user/\" + _friend.id);\r\n                const row = friendsTable.insertRow();\r\n                const cellId = row.insertCell(0);\r\n                const cellName = row.insertCell(1);\r\n                const cellEmail = row.insertCell(2);\r\n\r\n                cellId.innerText = friendData.id;\r\n                cellName.innerHTML = `<img src=\"${friendData.pfpURL}\" width=\"30\" height=\"30\" style=\"border-radius: 50%;\"> ${friendData.username}`;\r\n                cellEmail.innerText = friendData.email;\r\n            });\r\n        }\r\n    }\r\n});\n\n//# sourceURL=webpack://stealthnet-server/./webpack/admin/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./webpack/admin/index.js");
/******/ 	
/******/ })()
;