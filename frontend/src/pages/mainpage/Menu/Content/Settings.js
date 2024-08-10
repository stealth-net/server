import React, { useState, useEffect } from "react";
import Checkbox from "../../Components/Checkbox";
import Slider from "../../Components/Slider";
import Dropdown from "../../Components/Dropdown";
import { t, setLanguage, getCurrentLanguage, getSupportedLanguages } from "../../../../localization/i18n";

function Settings() {
    const [language, setLanguageState] = useState(getCurrentLanguage());

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
        setLanguageState(newLanguage);
    };

    return (
        <>
            <Checkbox title={t("Enable this option to show the send message button")} dataSetting="show-send-message-button" dataDefault="true" label={t("Show send message button")} />
            <Checkbox title={t("Enable this option to save your messages")} dataSetting="save-messages" dataDefault="true" label={t("Save messages")} />
            <Checkbox title={t("Enable this option to save your attachments")} dataSetting="save-attachments" dataDefault="true" label={t("Save attachments")} />
            <Slider dataSetting="space-between-messages" dataDefault="0" label={t("Space between message groups")} min="0" max="10" />
            <Checkbox title={t("Enable this option to require a shift key to perform message actions")} dataSetting="message-action-shift-require" dataDefault="false" label={t("Require shift key for message actions")} />
            <Checkbox title={t("Enable this option to enable animations for message actions")} dataSetting="message-action-animations" dataDefault="true" label={t("Enable animations for message actions")} />
            <Checkbox title={t("Enable this option to reduce animations")} dataSetting="reduced-animations" dataDefault="false" label={t("Reduced animations")} />
            <Dropdown title={t("Language")} dataSetting="language" dataDefault={language} label={t("Language")} options={getSupportedLanguages()} handleChange={handleLanguageChange} />
        </>
    );
}

export default Settings;