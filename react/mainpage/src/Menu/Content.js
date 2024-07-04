import React, { memo } from "react";
import Home from "./Content/Home/Home";
import Settings from "./Content/Settings/Settings";

function Content({ activeTab }) {
    return (
        <div className="menu-content">
            {activeTab === 'Home' && <Home />}
            {activeTab === 'Settings' && <Settings />}
        </div>
    );
}

export default memo(Content);