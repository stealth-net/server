import React, { useState, useEffect } from "react";
import events from "../../events";
import { formatTimestamp } from "../../Utils";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        events.on("fetchedProfile", (user) => {
            setUser(user);
        });

        return () => {
            events.off("fetchedProfile");
        };
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile">
            <div className="menu-separator">
                <label>{user.username}</label>
            </div>
            <hr />
            <div className="centered">
                <img src={user.pfpURL} width="128" height="128" alt="Profile" />
                <br />
                <label>StealthNet member since:</label>
                <br />
                <label>{formatTimestamp(user.creationTime)}</label>
                <hr />
                <button
                    onClick={() => {
                        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
                        window.location.reload();
                    }}
                    id="profile-logout" style={{ width: '80%' }}>Log Out</button>
            </div>
        </div>
    );
}

export default Profile;