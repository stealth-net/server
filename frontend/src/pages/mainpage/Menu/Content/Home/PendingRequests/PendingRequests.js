import React, { useState, useEffect } from "react";
import { postData } from "../../../../Utils"
import events from "../../../../events"
import socket from "../../../../Network/socket"
import { useFriends } from "../Friends/FriendsContext";
import { t } from "../../.././../../../localization/i18n"

function PendingRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const { setFriends } = useFriends();

    useEffect(() => {
        const handleFetchedProfile = (profile) => {
            const receivedRequests = (profile.friendRequests || []).map(request => ({ ...request, ownRequest: false }));
            const sentRequests = (profile.friendRequestsOwn || []).map(request => ({ ...request, ownRequest: true }));
            setPendingRequests([...receivedRequests, ...sentRequests]);
        };

        events.on("fetchedProfile", handleFetchedProfile);

        socket.on("friendRemove", id => removeFriend(id));
        socket.on("friendRequest", userData => addPendingRequest(userData, false));
        socket.on("friendRequestCancel", userData => removeFriendRequest(userData.id));
        socket.on("friendRequestAccept", userData => {
            addFriend(userData);
            events.emit("friendRequestAccepted", userData);
        });
    }, []);

    const handleCancelOrDenyRequest = async (userData, ownRequest) => {
        if (ownRequest) {
            await postData("/user-api/v1/cancel-friend-request", { id: userData.id }, "POST");
        } else {
            await postData("/user-api/v1/deny-friend-request", { id: userData.id }, "POST");
        }
    }

    const handleAcceptRequest = async (userData) => {
        await postData("/user-api/v1/accept-friend-request", { id: userData.id }, "POST");
        events.emit("friendRequestAccepted", userData);
        setFriends(prevFriends => [...prevFriends, userData]);
    }

    const addFriend = (userData) => {
        events.emit("friendAdded", userData);
    }

    const removeFriend = (id) => {
        setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    }

    const addPendingRequest = (userData, ownRequest) => {
        setPendingRequests(prevRequests => [...prevRequests, { ...userData, ownRequest }]);
    }

    const removeFriendRequest = (id) => {
        setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    }

    const AcceptButton = ({ userData }) => (
        <button className="action-button" onClick={async () => {
            await handleAcceptRequest(userData);
            removeFriendRequest(userData.id);
        }}>
            <svg width="21" height="17" viewBox="0 0 21 17">
                <line x1="1.34874" y1="8.52322" x2="8.95535" y2="15.4703" stroke="#4E6A40" strokeWidth="4" />
                <line x1="8.58579" y1="12.9263" x2="19.1924" y2="2.31967" stroke="#4E6A40" strokeWidth="4" />
            </svg>
        </button>
    );

    const CancelOrDenyButton = ({ userData, ownRequest }) => (
        <button className="action-button" onClick={async () => {
            await handleCancelOrDenyRequest(userData, ownRequest);
            removeFriendRequest(userData.id);
        }}>
            <svg width="24" height="24" viewBox="0 0 28 22">
                <line x1="2.41421" y1="1.88596" x2="21.114" y2="20.5858" stroke="#6A4040" strokeWidth="4" />
                <line x1="2.23007" y1="20.3978" x2="21.0421" y2="1.58577" stroke="#6A4040" strokeWidth="4" />
            </svg>
        </button>
    );

    return (
        <>
            <input id="friend-username" type="text" placeholder="Username" style={{ width: '91.5%' }} />
            <button style={{ width: '8%' }} onClick={async () => {
                const userData = await postData("/user-api/v1/add-friend", { username: document.getElementById("friend-username").value }, "POST");

                if (userData)
                    setPendingRequests([...pendingRequests, { ...userData, ownRequest: true }]);
            }}>{t("Add")}</button>
            <div>
                <ul id="pending-list" style={{ padding: "0" }}>
                    {pendingRequests.map((userData, index) => {
                        return (
                            <li key={index} id={"request-" + userData.id} className="friend-container">
                                <img width="64" height="64" src={userData.pfpURL} alt="Profile" />
                                <label style={{ margin: "0px 0px 0px 3px" }}>{userData.username}</label>
                                <div className="container-actions">
                                    {!userData.ownRequest && <AcceptButton userData={userData} />}
                                    <CancelOrDenyButton userData={userData} ownRequest={userData.ownRequest} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default PendingRequests;