import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSendOtp, useResetPassword } from '../../../hooks/useAuth';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Business logic now lives entirely in the hooks!
    const sendOtpMutation = useSendOtp(() => setStep(2));
    const resetPasswordMutation = useResetPassword();

    const handleSendOtp = (e) => {
        e.preventDefault();
        sendOtpMutation.mutate(email);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setPasswordError('');
        if (newPassword !== confirmPassword) {
            return setPasswordError('Passwords do not match!');
        }
        resetPasswordMutation.mutate({ email, otp, newPassword });
    };

    return (
        <div>
            {/* Step indicator */}
            <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 30, height: 30, backgroundColor: '#6366f1', color: 'white', fontSize: 14 }}>
                    1
                </div>
                <div style={{ height: 2, width: 40, backgroundColor: step === 2 ? '#6366f1' : '#cbd5e1' }}></div>
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 30, height: 30, backgroundColor: step === 2 ? '#6366f1' : '#cbd5e1', color: 'white', fontSize: 14 }}>
                    2
                </div>
            </div>

            {step === 1 ? (
                <>
                    <h3 className="fw-bold mb-2 text-center">Forgot Password?</h3>
                    <p className="text-muted text-center mb-4">Enter your email and we'll send you a 6-digit OTP.</p>
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={sendOtpMutation.isPending}>
                            {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <h3 className="fw-bold mb-2 text-center">Enter OTP</h3>
                    <p className="text-muted text-center mb-4">
                        We sent a 6-digit code to <strong>{email}</strong>
                    </p>
                    <form onSubmit={handleResetPassword}>
                        {passwordError && <div className="alert alert-danger py-2">{passwordError}</div>}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">6-Digit OTP</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 483920"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Min. 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repeat new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={resetPasswordMutation.isPending}>
                            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button type="button" className="btn btn-link w-100 mt-2 text-muted" onClick={() => setStep(1)}>
                            ← Change Email
                        </button>
                    </form>
                </>
            )}

            <p className="mt-4 text-muted text-center">
                Remember it? <Link to="/login" className="text-primary fw-semibold">Back to Login</Link>
            </p>
        </div>
    );
};

export default ForgotPassword;
