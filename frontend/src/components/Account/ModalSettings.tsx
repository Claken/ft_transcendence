import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import TwoFaConfig from '../../pages/TwoFaConfig';
import AvatarUpload from './AvatarUpload';
import ChooseName from './ChooseName';
import Twofa from './Twofa';

const ModalSettings = () => {
	const { user } = useAuth();
	const [toggleTwoFaConfig, setToggleTwoFaConfig] = useState<boolean>(false);

  return (
        <div className="modal-settings">
            {toggleTwoFaConfig ? (
            <>
                <TwoFaConfig />
            </>
            ) : (
            <>
            <div className="picture-settings">
                <div className="profile-picture">
                    <img
                        src={user?.avatarUrl}
                        alt="profilePic"
                    />
                </div>
                {user?.login && (
                    <div className="uploadButton">
                        <AvatarUpload />
                    </div>
                )}
            </div>
            <div className="username-settings">
                <h2>{user?.name}</h2>
                <ChooseName />
            </div>
            <div className="twoFA-settings">
                <h2>2FA
                    {user?.isTwoFAEnabled ? (
                    <span style={{ color: "green" }}>
                        On
                    </span>) : (
                        <span style={{ color: "red" }}>
                        Off
                    </span>
                    )}
                </h2>
                <Twofa toggleTwoFaConfig={toggleTwoFaConfig} setToggleTwoFaConfig={setToggleTwoFaConfig} />
            </div>
            </>
            )}
            
        </div>
  )
}

export default ModalSettings