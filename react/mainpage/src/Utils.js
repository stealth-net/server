export async function getData(url) {
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
                }

                resolve(jsonResponse);
            } else {
                reject(new Error(`HTTP Error: ${xhr.status}`));
            }
        }

        xhr.onerror = () => {
            reject(new Error('Network request failed'));
        }

        xhr.send();
    });
}

export async function postData(url, data, method) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.open(method, url, true);

        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status < 300) {
                let jsonResponse;

                try {
                    jsonResponse = JSON.parse(xhr.responseText);
                } catch(error) {
                    resolve(xhr.responseText);
                    return;
                }

                resolve(jsonResponse);
            } else {
                reject(new Error(`HTTP Error: ${xhr.status}`));
            }
        }

        xhr.onerror = () => {
            reject(new Error('Network request failed'));
        }

        const requestData = typeof data === 'object' ? JSON.stringify(data) : data;

        if(typeof data === "object")
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        if(typeof data === "string")
            xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");

        xhr.send(requestData);
    });
}

export function getFormattedDates(chartData) {
    return chartData.map(timestamp => {
        const date = new Date(timestamp.time);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    });
}

export function getDayOfMonth(chartData) {
    return chartData.map(timestamp => {
        const date = new Date(timestamp.time);
        return date.getDate();
    });
}

export function getScore(chartData) {
    return chartData.map(timestamp => {
        return timestamp.score;
    });
}

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `[${year}-${month}-${day}] ${hours}:${minutes}:${seconds}`;
}