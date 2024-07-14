import React from 'react';

const Avatar = ({ pfpURL, status, width = "64", height = "64" }) => (
    <div className="avatar">
        <img src={pfpURL} alt="Avatar" width={width} height={height} />
        {status && <div className="status" style={{ left: width - width / 3, width: width / 4, height: width / 4 }} state={status}></div>}
    </div>
);

export default Avatar;