document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
    applySettingsToUI();
    attachEventListeners();
});

function initializeSettings() {
    const defaultConfig = {};
    document.querySelectorAll(".checkbox-input[data-setting]").forEach(input => {
        const settingName = input.getAttribute("data-setting");
        const defaultValue = input.getAttribute("data-default") === "true";
        defaultConfig[settingName] = defaultValue;
    });

    const currentConfig = JSON.parse(localStorage.getItem("config")) || {};
    const config = { ...defaultConfig, ...currentConfig };
    localStorage.setItem('config', JSON.stringify(config));
}

function applySettingsToUI() {
    const config = JSON.parse(localStorage.getItem('config'));
    for (const [key, value] of Object.entries(config)) {
        const input = document.querySelector(`.checkbox-input[data-setting="${key}"]`);
        if (input) {
            input.checked = value;
        }
    }
}

function attachEventListeners() {
    document.querySelectorAll(".checkbox-input[data-setting]").forEach(input => {
        input.addEventListener("change", () => {
            const settingName = input.getAttribute('data-setting');
            const config = JSON.parse(localStorage.getItem('config'));
            config[settingName] = input.checked;
            localStorage.setItem('config', JSON.stringify(config));
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

export default {
    getValue
}