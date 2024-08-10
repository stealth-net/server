import React, { useState, useEffect } from "react";
import events from "../../events";
import { formatTimestamp } from "../../Utils";
import { t } from "../../../../localization/i18n"

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

    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result;
            const payload = JSON.stringify({ base64 });

            try {
                const response = await fetch('/user-api/v1/edit-pfp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: payload,
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(prevState => ({ ...prevState, pfpURL: data.pfpURL }));
                } else {
                    throw new Error(data.message || 'Failed to update profile picture');
                }
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        };
        reader.readAsDataURL(file);
    };

    if (!user) {
        return <div>{t("Loading")}...</div>;
    }

    return (
        <div className="profile">
            <div className="menu-separator">
                <label>{user.username}</label>
            </div>
            <hr />
            <div className="centered">
                <input type="file" id="profile-pic-input" style={{ display: 'none' }} onChange={handleProfilePicChange} />
                <img src={user.pfpURL} width="128" height="128" alt="Profile" onClick={() => document.getElementById('profile-pic-input').click()} />
                <br />
                <label>{t("StealthNet member since")}:</label>
                <br />
                <label>{formatTimestamp(user.creationTime)}</label>
                <hr />
                <button
                    onClick={() => {
                        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
                        window.location.reload();
                    }}
                    id="profile-logout" style={{ width: '80%' }}>{t("Logout")}</button>
            </div>
        </div>
    );
}

export default Profile;