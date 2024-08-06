import "../../../../Components/Action.css";
import "./Friends.css";
import React, { useEffect, useCallback } from "react";
import events from "../../../../events";
import { useFriends } from './FriendsContext';
import { postData } from "../../../../Utils";
import socket from "../../../../Network/socket";
import { useDM } from '../Direct/DMContext';
import Avatar from '../../../../Components/Avatar';

function Friends() {
    const { friends = [], setFriends } = useFriends(); // Default to an empty array
    const { dmList, setDmList } = useDM();

    const removeFriend = useCallback((id) => {
        setFriends(prevFriends => prevFriends.filter(friend => friend.id !== id));
    }, [setFriends]);

    const updateOnlineCount = useCallback(() => {
        if (friends) {
            document.getElementById("online-count").textContent = friends.filter(friend => friend.status === "online").length;
        }
    }, [friends]);

    useEffect(() => {
        const handleFetchedProfile = (profile) => {
            if (profile && profile.friends && Array.isArray(profile.friends)) {
                setFriends(profile.friends);
            } else {
                setFriends([]);
            }
        };

        const handleFriendAdded = (userData) => {
            setFriends(prevFriends => [...prevFriends, userData]);
        };

        events.on("fetchedProfile", handleFetchedProfile);
        events.on("friendAdded", handleFriendAdded);

        socket.on("friendRemove", id => removeFriend(id));
        socket.on("statusChanged", (userId, newStatus) => {
            const friendElement = document.getElementById(`friend-${userId}`);
            if (friendElement) {
                const statusDiv = friendElement.querySelector('.friend-status');
                if (statusDiv) {
                    statusDiv.setAttribute('state', newStatus);
                }
            }
            updateOnlineCount();
            const dmElement = document.querySelector(`#dm-list > .friend-container[id="${userId}"]`);
            if (dmElement) {
                const statusDiv = dmElement.querySelector('.dm-status');
                if (statusDiv) {
                    statusDiv.textContent = newStatus;
                }
            }
        });

        return () => {
            events.off("fetchedProfile", handleFetchedProfile);
            events.off("friendAdded", handleFriendAdded);
            socket.off("friendRemove");
            socket.off("statusChanged");
        };
    }, [setFriends, removeFriend, updateOnlineCount]);

    const addDM = (userData) => {
        const existingDM = dmList.find(dm => dm.id === userData.id);
        if (!existingDM) {
            setDmList([...dmList, userData]);
        }
    };

    const DMButton = ({ friend }) => (
        <button className="action-button" onClick={() => addDM(friend)}>
            <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.83333 8H6.845M11.5 8H11.5117M16.1667 8H16.1783M22 17L18.1216 15.3378C17.8276 15.2118 17.6806 15.1488 17.5265 15.1044C17.3898 15.065 17.249 15.0365 17.1061 15.0193C16.9451 15 16.7807 15 16.452 15H4.73333C3.42654 15 2.77315 15 2.27402 14.782C1.83497 14.5903 1.47802 14.2843 1.25432 13.908C1 13.4802 1 12.9201 1 11.8V4.2C1 3.07989 1 2.51984 1.25432 2.09202C1.47802 1.71569 1.83497 1.40973 2.27402 1.21799C2.77315 1 3.42655 1 4.73333 1H18.2667C19.5734 1 20.2269 1 20.726 1.21799C21.165 1.40973 21.522 1.71569 21.7457 2.09202C22 2.51984 22 3.0799 22 4.2V17Z" stroke="#51567C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
    );

    const RemoveButton = ({ friend }) => (
        <button className="action-button" onClick={async () => {
            await postData("/user-api/v1/remove-friend", { id: friend.id }, "POST");
            removeFriend(friend.id);
        }}>
            <svg width="24" height="24" viewBox="0 0 28 22" xmlns="http://www.w3.org/2000/svg">
                <line x1="2.41421" y1="1.88596" x2="21.114" y2="20.5858" stroke="#6A4040" stroke-width="4" />
                <line x1="2.23007" y1="20.3978" x2="21.0421" y2="1.58577" stroke="#6A4040" stroke-width="4" />
            </svg>
        </button>
    );

    return (
        <>
            <label>Online: </label><span id="online-count">{Array.isArray(friends) ? friends.filter(friend => friend.status === "online").length : 0}</span>
            <div id="friend-list">
                {Array.isArray(friends) ? friends.map((friend, index) => (
                    <div key={index} id={"friend-" + friend.id} className="friend-container" style={{ position: 'relative' }}
                        onMouseEnter={() => {
                            document.querySelector(`#friend-${friend.id} .container-actions`).style.display = 'flex';
                        }}
                        onMouseLeave={() => {
                            document.querySelector(`#friend-${friend.id} .container-actions`).style.display = 'none';
                        }}>
                        <Avatar pfpURL={friend.pfpURL} status={friend.status} />
                        <label>{friend.username}</label>
                        <div className="container-actions" style={{ right: '10px', top: '10px', display: 'none' }}>
                            <DMButton friend={friend} />
                            <RemoveButton friend={friend} />
                        </div>
                    </div>
                )) : null}
            </div>
        </>
    );
}

export default Friends;