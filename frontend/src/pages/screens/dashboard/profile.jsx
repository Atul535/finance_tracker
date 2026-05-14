import React, { useState, useEffect } from 'react';
import { useGetProfile, useUpdateProfile, useChangePassword } from '../../../hooks/useProfile';

const Profile = () => {
  const { data: profile, isLoading } = useGetProfile();
  
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword(() => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  });

  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // When profile data loads from the backend, set the initial form state
  useEffect(() => {
    if (profile) {
      setProfileData({ name: profile.name, email: profile.email });
      setPreviewUrl(profile.profilePictureUrl);
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Create a temporary URL to preview the image before actually uploading it
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    // We MUST use FormData because we are sending an actual file to Multer!
    const formData = new FormData();
    if (profileData.name !== profile.name) {
        formData.append('name', profileData.name);
    }
    if (profilePicture) {
        formData.append('profilePicture', profilePicture);
    }
    
    // Only submit if the user actually changed something
    if (profileData.name !== profile.name || profilePicture) {
        updateProfileMutation.mutate(formData);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordError("New passwords do not match!");
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  if (isLoading) {
    return <p className="text-muted">Loading profile settings...</p>;
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">Profile & Settings</h2>

      <div className="row g-4">
        {/* Profile Update Column */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Public Profile</h5>
              
              <form onSubmit={handleProfileSubmit}>
                <div className="d-flex align-items-center gap-4 mb-4">
                  {/* Avatar Preview Box */}
                  <div 
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center overflow-hidden" 
                    style={{ width: '100px', height: '100px', border: '3px solid var(--primary)' }}
                  >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span className="text-white fw-bold fs-3">{profile?.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  
                  <div>
                    <label className="btn btn-outline-primary btn-sm fw-bold">
                      Change Picture
                      <input type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                    </label>
                    <p className="text-muted small mt-1 mb-0">JPG, PNG or WebP (Max 5MB)</p>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Display Name</label>
                  <input type="text" name="name" className="form-control" value={profileData.name} onChange={handleProfileChange} required />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Email Address <small className="text-muted">(Read Only)</small></label>
                  <input type="email" className="form-control text-muted" value={profileData.email} disabled />
                </div>

                <button type="submit" className="btn btn-primary fw-bold w-100" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? 'Saving to Cloudinary...' : 'Save Profile Changes'}
                </button>
              </form>

            </div>
          </div>
        </div>

        {/* Security Column */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Security</h5>

              <form onSubmit={handlePasswordSubmit}>
                {passwordError && <div className="alert alert-danger py-2">{passwordError}</div>}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Current Password</label>
                  <input type="password" name="currentPassword" className="form-control" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">New Password</label>
                  <input type="password" name="newPassword" className="form-control" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6" />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Confirm New Password</label>
                  <input type="password" name="confirmPassword" className="form-control" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength="6" />
                </div>

                <button type="submit" className="btn btn-danger bg-opacity-75 fw-bold w-100" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending ? 'Updating...' : 'Change Password'}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
