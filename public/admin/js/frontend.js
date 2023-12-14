const dashboardCharts = document.querySelectorAll(".chartlist > *[apiname]");

async function getData(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);

        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status < 300) {
                let jsonResponse;

                try {
                    jsonResponse = JSON.parse(xhr.responseText);
                } catch(error) {
                    resolve(xhr.responseText);
                    return;
                };

                resolve(jsonResponse);
            } else {
                reject(new Error(`HTTP Error: ${xhr.status}`));
            };
        };

        xhr.onerror = () => {
            reject(new Error('Network request failed'));
        };

        xhr.send();
    });
};

function getFormattedDates(chartData) {
    return chartData.map(timestamp => {
        const date = new Date(timestamp.time);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    });
};

function getDayOfMonth(chartData) {
    return chartData.map(timestamp => {
        const date = new Date(timestamp.time);
        return date.getDate();
    });
};

function getScore(chartData) {
    return chartData.map(timestamp => {
        return timestamp.score;
    });
};