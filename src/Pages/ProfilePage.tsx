import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../utils/withRouter';
import { RootState, AppDispatch } from '../store';
import { logout, updateUserProfile, changePassword } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';
import styles from './ProfilePage.module.css';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import profileIcon from '../assets/profile.png';
import userIcon from '../assets/user.png';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  cellNumber: string;
}

interface Props {
  user: any;
  loading: boolean;
  error: string | null;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  logout: () => void;
  showNotification: (notification: any) => void;
  navigate: (path: string) => void;
}

interface State {
  isEditing: boolean;
  profile: UserProfile;
  editingProfile: UserProfile;
  showPasswordPanel: boolean;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

class ProfilePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        cellNumber: ''
      },
      editingProfile: {
        firstName: '',
        lastName: '',
        email: '',
        cellNumber: ''
      },
      showPasswordPanel: false,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
  }

  componentDidMount() {
    if (this.props.user) {
      const userProfile: UserProfile = {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        cellNumber: this.props.user.cellNumber
      };
      this.setState({
        profile: userProfile,
        editingProfile: userProfile
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.user !== this.props.user && this.props.user) {
      const userProfile: UserProfile = {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        cellNumber: this.props.user.cellNumber
      };
      this.setState({
        profile: userProfile,
        editingProfile: userProfile
      });
    }
  }

  handleEdit = () => {
    this.setState({
      editingProfile: { ...this.state.profile },
      isEditing: true
    });
  };

  handleCancel = () => {
    this.setState({
      editingProfile: { ...this.state.profile },
      isEditing: false
    });
  };

  handleSave = async () => {
    await this.props.updateUserProfile(this.state.editingProfile);
    if (!this.props.error) {
      this.setState({
        profile: { ...this.state.editingProfile },
        isEditing: false
      });

    } else {

    }
  };

  handleInputChange = (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      editingProfile: {
        ...this.state.editingProfile,
        [field]: e.target.value
      }
    });
  };

  handleSignOut = () => {
    this.props.logout();
    this.props.navigate('/login');
  };

  togglePasswordPanel = () => {
    this.setState((s) => ({ showPasswordPanel: !s.showPasswordPanel }));
  };

  handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = this.state;
    if (!currentPassword || !newPassword) {
      this.props.showNotification({ message: 'Please fill in all password fields', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      this.props.showNotification({ message: 'New password must be at least 6 characters', type: 'error' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      this.props.showNotification({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    await (this.props as any).changePassword({ currentPassword, newPassword });
    if (!this.props.error) {
      this.props.showNotification({ message: 'Password updated successfully', type: 'success' });
      this.setState({ currentPassword: '', newPassword: '', confirmNewPassword: '', showPasswordPanel: false });
    }
  };

  render() {
    const { user, loading } = this.props;
    const { isEditing, profile, editingProfile } = this.state;
    const userName = user ? user.firstName : 'User';

    return (
      <div className={styles.container}>
        <Header 
          userName={userName} 
          showNavigation={true}
          onLogout={this.handleSignOut}
        />
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.pageHeader}>
              <div className={styles.headerIcon}>
                <img src={profileIcon} alt="Profile" style={{ width: '32px', height: '32px' }} />
              </div>
              <div>
                <h1 className={styles.pageTitle}>Profile</h1>
                <p className={styles.pageSubtitle}>Manage your account settings</p>
              </div>
            </div>
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <img src={userIcon} alt="Settings" style={{ width: '20px', height: '20px' }} />
                </div>
                <div className={styles.cardHeaderText}>
                  <h2 className={styles.cardTitle}>Personal Information</h2>
                  <p className={styles.cardSubtitle}>Update your personal details</p>
                </div>
                {!isEditing && (
                  <Button 
                    variant="secondary" 
                    onClick={this.handleEdit}
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
                      onChange={this.handleInputChange('firstName')}
                      placeholder="First Name"
                      className={!isEditing ? styles.readOnlyInput : ''}
                    />
                  </div>
                  <div className={styles.gridItem}>
                    <Input
                      label="Last Name"
                      value={isEditing ? editingProfile.lastName : profile.lastName}
                      onChange={this.handleInputChange('lastName')}
                      placeholder="Last Name"
                      className={!isEditing ? styles.readOnlyInput : ''}
                    />
                  </div>
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={isEditing ? editingProfile.email : profile.email}
                  onChange={this.handleInputChange('email')}
                  placeholder="Email"
                  className={!isEditing ? styles.readOnlyInput : ''}
                />
                <Input
                  label="Cell Number"
                  type="tel"
                  value={isEditing ? editingProfile.cellNumber : profile.cellNumber}
                  onChange={this.handleInputChange('cellNumber')}
                  placeholder="Cell Number"
                  className={!isEditing ? styles.readOnlyInput : ''}
                />
                {isEditing && (
                  <div className={styles.formActions}>
                    <Button 
                      variant="primary" 
                      onClick={this.handleSave}
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={this.handleCancel}
                      disabled={loading}
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
              <div className={styles.passwordCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Change Password</h3>
                  <Button variant="secondary" onClick={this.togglePasswordPanel}>
                    {this.state.showPasswordPanel ? 'Close' : 'Change Password'}
                  </Button>
                </div>
                {this.state.showPasswordPanel && (
                  <div className={styles.cardContent}>
                    <Input
                      label="Current Password"
                      type="password"
                      value={this.state.currentPassword}
                      onChange={(e: any) => this.setState({ currentPassword: e.target.value })}
                      placeholder="Enter current password"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={this.state.newPassword}
                      onChange={(e: any) => this.setState({ newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={this.state.confirmNewPassword}
                      onChange={(e: any) => this.setState({ confirmNewPassword: e.target.value })}
                      placeholder="Re-enter new password"
                    />
                    <div className={styles.formActions}>
                      <Button variant="primary" onClick={this.handlePasswordChange} disabled={this.props.loading}>
                        Update Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                variant="secondary" 
                onClick={this.handleSignOut}
                className={styles.signOutButton}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  loading: state.auth.loading,
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateUserProfile: (profileData: Partial<UserProfile>) => dispatch(updateUserProfile(profileData)),
  logout: () => dispatch(logout()),
  showNotification: (notification: any) => dispatch(showNotification(notification)),
  changePassword: (args: { currentPassword: string; newPassword: string }) => dispatch(changePassword(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfilePage));