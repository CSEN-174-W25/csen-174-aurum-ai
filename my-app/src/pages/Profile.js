import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { MapPin, Edit2, UserRound, Save, X } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import './styles/Profile.css';

function Profile() {
    const auth = getAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        bio: "",
        location: "",
    });

    const [editForm, setEditForm] = useState({
        bio: userData.bio,
        location: userData.location,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userDoc = await getDoc(doc(db, 'userInfo', auth.currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(prev => ({
                    ...prev,
                    bio: data.bio || prev.bio,
                    location: data.location || prev.location,
                }));
                setEditForm({
                    bio: data.bio || userData.bio,
                    location: data.location || userData.location,
                });
            }
        };
        
        if (auth.currentUser) {
            fetchUserData();
        }
    }, [auth.currentUser, userData.bio, userData.location]);

    const handleSave = async () => {
        try {
            await setDoc(doc(db, 'userInfo', auth.currentUser.uid), {
                bio: editForm.bio,
                location: editForm.location,
            }, { merge: true });
            
            setUserData(prev => ({
                ...prev,
                bio: editForm.bio,
                location: editForm.location,
            }));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <UserRound className='profile-avatar'/>
                <h1 className="profile-name">{userData.name}</h1>
                <p className="profile-email">{userData.email}</p>
                
                {isEditing ? (
                    <div className="profile-edit-form">
                        <textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Enter your bio"
                            className="profile-edit-input"
                        />
                        <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter your location"
                            className="profile-edit-input"
                        />
                        <div className="profile-edit-buttons">
                            <button onClick={handleSave} className="profile-save-button">
                                <Save size={16} />
                                Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className="profile-cancel-button">
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="profile-bio">{userData.bio}</p>
                        <p className="profile-location">
                            <MapPin size={16} />
                            {userData.location}
                        </p>
                        <button className="profile-edit-button" onClick={() => setIsEditing(true)}>
                            <Edit2 size={16} />
                            Edit Profile
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Profile;