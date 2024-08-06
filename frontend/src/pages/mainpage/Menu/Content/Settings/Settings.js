import React from "react";
import Checkbox from "../../../Components/Checkbox";
import Slider from "../../../Components/Slider";

function Settings() {
    return (
        <>
            <Checkbox title="Enable this option to show the send message button" dataSetting="show-send-message-button" dataDefault="true" label="Show send message button" />
            <Checkbox title="Enable this option to save your messages" dataSetting="save-messages" dataDefault="true" label="Save messages" />
            <Checkbox title="Enable this option to save your attachments" dataSetting="save-attachments" dataDefault="true" label="Save attachments" />
            <Slider dataSetting="space-between-messages" dataDefault="0" label="Space between message groups" min="0" max="10" />
            <Checkbox title="Enable this option to require a shift key to perform message actions" dataSetting="message-action-shift-require" dataDefault="false" label="Require shift key for message actions" />
            <Checkbox title="Enable this option to enable animations for message actions" dataSetting="message-action-animations" dataDefault="true" label="Enable animations for message actions" />
            <Checkbox title="Enable this option to reduce animations" dataSetting="reduced-animations" dataDefault="false" label="Reduced animations" />
        </>
    );
}

export default Settings;