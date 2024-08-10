import React from 'react';
import './Popup.css';
import { t } from '../../../../localization/i18n';

const GuildPopup = ({ onClose }) => {
  return (
    <div className="guild-popup">
      <button style={{width: '45px', height: '45px', fontSize: 'xx-large'}} className="close-button" onClick={onClose}>×</button>
      <h2>{t('Create or Join Guild')}</h2>
      <div className="guild-popup-content">
        <div className="guild-popup-section">
          <p>{t('Create a guild to bring together a community.')}</p>
          <input type="text" placeholder={t('Guild name')} />
          <button>{t('Create')}</button>
        </div>
        <div className="guild-popup-section">
          <p>{t('Looking to join a community?')}</p>
          <input type="text" placeholder={t('Invite code')} />
          <button>{t('Join')}</button>
        </div>
      </div>
    </div>
  );
};

export default GuildPopup;