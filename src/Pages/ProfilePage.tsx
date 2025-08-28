import React, { useState } from 'react';
import styles from './ProfilePage.module.css';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import userIcon from '../assets/user.png';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  cellNumber: string;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    cellNumber: ''
  });
  const [editingProfile, setEditingProfile] = useState<UserProfile>(profile);
  
  // Placeholder user data - TODO: Get from authentication state
  const userName = "Joseph";

  const handleEdit = () => {
    setEditingProfile(profile);
    setIsEditing(true);
    // TODO: Populate form with current user data from state/API
  };

  const handleCancel = () => {
    setEditingProfile(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(editingProfile);
    setIsEditing(false);
    // TODO: Send updated profile data to API
    // TODO: Show success message
    console.log('Profile updated:', editingProfile);
  };

  const handleInputChange = (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingProfile(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSignOut = () => {
    // TODO: Clear authentication state
    // TODO: Navigate to login page
    // TODO: Show confirmation dialog before signing out
    console.log('Sign out clicked');
  };

  return (
    <div className={styles.container}>
      <Header 
        userName={userName} 
        showNavigation={true} 
      />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.headerIcon}>
              <img src={userIcon} alt="Profile" width="32" height="32" />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Profile</h1>
              <p className={styles.pageSubtitle}>Manage your account settings</p>
            </div>
          </div>

          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <span>⚙️</span>
              </div>
              <div className={styles.cardHeaderText}>
                <h2 className={styles.cardTitle}>Personal Information</h2>
                <p className={styles.cardSubtitle}>Update your personal details</p>
              </div>
              {!isEditing && (
                <Button 
                  variant="secondary" 
                  onClick={handleEdit}
                  className={styles.editButton}
                >
                  Edit
                </Button>
              )}
            </div>

            <div className={styles.cardContent}>
              <div className={styles.formGrid}>
                <div className={styles.gridItem}>
                  <Input
                    label="First Name"
                    value={isEditing ? editingProfile.firstName : profile.firstName}
                    onChange={handleInputChange('firstName')}
                    placeholder="First Name"
                    className={!isEditing ? styles.readOnlyInput : ''}
                  />
                </div>
                <div className={styles.gridItem}>
                  <Input
                    label="Last Name"
                    value={isEditing ? editingProfile.lastName : profile.lastName}
                    onChange={handleInputChange('lastName')}
                    placeholder="Last Name"
                    className={!isEditing ? styles.readOnlyInput : ''}
                  />
                </div>
              </div>

              <Input
                label="Email"
                type="email"
                value={isEditing ? editingProfile.email : profile.email}
                onChange={handleInputChange('email')}
                placeholder="Email"
                className={!isEditing ? styles.readOnlyInput : ''}
              />

              <Input
                label="Cell Number"
                type="tel"
                value={isEditing ? editingProfile.cellNumber : profile.cellNumber}
                onChange={handleInputChange('cellNumber')}
                placeholder="Cell Number"
                className={!isEditing ? styles.readOnlyInput : ''}
              />

              {isEditing && (
                <div className={styles.formActions}>
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                  >
                    💾 Save Changes
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.dangerZone}>
            <div className={styles.dangerHeader}>
              <h2 className={styles.dangerTitle}>Danger Zone</h2>
              <p className={styles.dangerSubtitle}>Actions that affect your account</p>
            </div>
            
            <Button 
              variant="secondary" 
              onClick={handleSignOut}
              className={styles.signOutButton}
            >
              🚪 Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;