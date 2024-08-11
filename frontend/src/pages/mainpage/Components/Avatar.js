import React from 'react';
import './Avatar.css';

const Avatar = ({ pfpURL, status, width = "64", height = "64" }) => {
	const statusSize = parseInt(width) / 4;
	return (
		<div className="avatar-wrapper">
			<img src={pfpURL} className="avatar" width={width} height={height} alt="User avatar" />
			{status && (
				<div
					className="status-indicator"
					style={{
						backgroundColor: `var(--${status}-status)`,
						width: `${statusSize}px`,
						height: `${statusSize}px`
					}}
				></div>
			)}
		</div>
	);
};

export default Avatar;