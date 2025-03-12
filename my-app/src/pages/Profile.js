import React from 'react';
import { getAuth } from 'firebase/auth';
import { MapPin, Edit2, UserRound } from 'lucide-react';
import './styles/Profile.css';

function Profile() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const user = {
        name: currentUser.displayName,
        email: currentUser.email,
        avatar: "https://via.placeholder.com/150",
        bio: "Software Developer | React Enthusiast",
        location: "San Francisco, CA",
        stats: {
            projects: 12,
            followers: 248,
            following: 186
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <img src={user.avatar} alt="Profile" className="profile-avatar" />
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-email">{user.email}</p>
                <p className="profile-bio">{user.bio}</p>
                <p className="profile-location">
                    <MapPin size={16} />
                    {user.location}
                </p>
                
                <button className="profile-edit-button">
                    <Edit2 size={16} />
                    Edit Profile
                </button>

                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">{user.stats.projects}</div>
                        <div className="stat-label">Projects</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{user.stats.followers}</div>
                        <div className="stat-label">Followers</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{user.stats.following}</div>
                        <div className="stat-label">Following</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;