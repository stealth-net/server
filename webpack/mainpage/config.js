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

    document.querySelectorAll(".slider[data-setting]").forEach(input => {
        const settingName = input.getAttribute("data-setting");
        const defaultValue = parseInt(input.getAttribute("data-default"), 10);
        defaultConfig[settingName] = defaultValue;
    });

    const currentConfig = JSON.parse(localStorage.getItem("config")) || {};
    const config = { ...defaultConfig, ...currentConfig };
    localStorage.setItem('config', JSON.stringify(config));
}

function applySettingsToUI() {
    const config = JSON.parse(localStorage.getItem('config'));
    for (const [key, value] of Object.entries(config)) {
        const input = document.querySelector(`[data-setting="${key}"]`);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = value;
            } else if (input.type === 'range') {
                input.value = value;
                const sliderValueDisplay = input.closest('.slider-container').querySelector('.slider-value');
                if (sliderValueDisplay) {
                    sliderValueDisplay.textContent = value;
                }
            }
        } else {
            console.error(`Input element for setting '${key}' not found.`);
        }
    }
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