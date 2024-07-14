document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
    attachEventListeners();
});

const subscribers = [];

function initializeSettings() {
    const defaultConfig = {};
    document.querySelectorAll(".checkbox-input[data-setting]").forEach(input => {
        const settingName = input.getAttribute("data-setting");
        const defaultValue = input.getAttribute("data-default") === "true";
        defaultConfig[settingName] = defaultValue;
    });

    document.querySelectorAll(".slider[data-setting]").forEach(input => {
        const settingName = input.getAttribute("data-setting");
        const defaultValue = parseInt(input.getAttribute("data-default"), 10);
        defaultConfig[settingName] = defaultValue;
    });

    const currentConfig = JSON.parse(localStorage.getItem("config")) || {};
    const config = { ...defaultConfig, ...currentConfig };
    localStorage.setItem('config', JSON.stringify(config));
}

function attachEventListeners() {
    document.querySelectorAll("[data-setting]").forEach(input => {
        input.addEventListener("change", () => {
            const settingName = input.getAttribute('data-setting');
            const config = JSON.parse(localStorage.getItem('config'));
            let newValue = input.type === 'checkbox' ? input.checked : input.value;
            config[settingName] = input.type === 'checkbox' ? input.checked : parseInt(input.value, 10);
            localStorage.setItem('config', JSON.stringify(config));
            if (input.type === 'range') {
                const sliderValueDisplay = input.closest('.slider-container').querySelector('.slider-value');
                if (sliderValueDisplay) {
                    sliderValueDisplay.textContent = newValue;
                }
            }
            notifySubscribers();
        });
    });
}

function getValue(key) {
    const config = JSON.parse(localStorage.getItem('config')) || {};
    const value = config[key];
    if (value === undefined) {
        return null; // Return null if the key does not exist in the config
    }
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
}

function subscribe(callback) {
    if (typeof callback === 'function') {
        subscribers.push(callback);
    }
}

function unsubscribe(callback) {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
        subscribers.splice(index, 1);
    }
}

function notifySubscribers() {
    subscribers.forEach(callback => callback());
}

const configModule = {
    getValue,
    subscribe,
    unsubscribe
};

export default configModule;