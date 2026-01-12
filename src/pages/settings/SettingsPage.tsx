import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { sendOTPChangePassword, changePassword } from "../../utils";
import { Lock, Mail, Key, ShieldCheck, ChevronRight, ArrowLeft, Settings as SettingsIcon, Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { languageNames, flagEmojis } from "../../i18n";

// Sub-component for Change Password Flow
const ChangePasswordView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 1: Input passwords, 2: Input OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError(t("Please enter all password fields."));
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t("New password does not match confirmation."));
      return;
    }
    if (formData.newPassword.length < 6) {
      setError(t("New password must be at least 6 characters."));
      return;
    }

    try {
      setLoading(true);
      const res = await sendOTPChangePassword();
      setOtpToken(res.otpToken);
      setSuccess(t("OTP sent to your email."));
      setStep(2);
    } catch (err: any) {
      setError(err?.message || t("Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otpToken) {
      setError(t("Session expired, please request OTP again."));
      setStep(1);
      return;
    }
    if (!formData.otp) {
      setError(t("Please enter OTP."));
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        otp: formData.otp,
        otpToken,
      });
      setSuccess(t("Password changed successfully! Please login again."));
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
      setStep(1);
      setOtpToken(null);
    } catch (err: any) {
      setError(err?.message || t("Failed to change password."));
    } finally {
      setLoading(false);
    }
  };

  const handleBackStep = () => {
    setStep(1);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {t("Change Password")}
            </h2>
        </div>
        
        <div className="p-6">
            <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    {t("For your security, we require 2-step verification (2FA) via email when changing your password.")}
                </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
                {success}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleGetOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Current Password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={formData.oldPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, oldPassword: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={t("Enter current password")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("New Password")}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={t("Enter new password")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Confirm New Password")}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={t("Confirm new password")}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {t("Continue (Send OTP)")} <Mail className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{t("Verify OTP")}</h3>
                    <p className="text-sm text-gray-500">
                        {t("An authentication code has been sent to your email.")}
                    </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-center text-gray-700 mb-2">
                    {t("Enter OTP (6 digits)")}
                  </label>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.target.value })
                    }
                    className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:outline-none text-gray-800"
                    placeholder="------"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t("Back")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                     {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        t("Confirm Change")
                      )}
                  </button>
                </div>
              </form>
            )}
        </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [view, setView] = useState<'menu' | 'change_password'>('menu');

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-indigo-600" />
                    {t("Settings.Title")}
                </h1>

                {view === 'menu' ? (
                    <div className="space-y-6">
                      {/* Language Settings */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                              <h2 className="font-semibold text-gray-700">{t("Settings.Language")}</h2>
                          </div>
                          <div className="divide-y divide-gray-100">
                             <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                      <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{t("Settings.Language")}</div>
                                      <div className="text-sm text-gray-500">
                                        {languageNames[i18n.language] || i18n.language} {flagEmojis[i18n.language]}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  {Object.keys(languageNames).map((lng) => (
                                    <button
                                      key={lng}
                                      onClick={() => changeLanguage(lng)}
                                      className={`flex items-center justify-between px-4 py-2 rounded-lg border ${
                                        i18n.language === lng
                                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                                      }`}
                                    >
                                      <span className="flex items-center gap-2">
                                        <span>{flagEmojis[lng]}</span>
                                        <span>{languageNames[lng]}</span>
                                      </span>
                                      {i18n.language === lng && <Check className="w-4 h-4" />}
                                    </button>
                                  ))}
                                </div>
                             </div>
                          </div>
                      </div>

                      {/* Account Settings */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                              <h2 className="font-semibold text-gray-700">{t("Settings.Title")}</h2>
                          </div>
                          <div className="divide-y divide-gray-100">
                              <button 
                                  onClick={() => setView('change_password')}
                                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                              >
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                          <Lock className="w-5 h-5" />
                                      </div>
                                      <div>
                                          <div className="font-medium text-gray-900">{t("Change Password")}</div>
                                          <div className="text-sm text-gray-500">{t("Update password and security")}</div>
                                      </div>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                              </button>
                              
                              {/* Placeholder for future options */}
                              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left opacity-50 cursor-not-allowed">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                          <ShieldCheck className="w-5 h-5" />
                                      </div>
                                      <div>
                                          <div className="font-medium text-gray-900">Privacy (Coming Soon)</div>
                                          <div className="text-sm text-gray-500">Manage who can see your posts</div>
                                      </div>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                              </button>
                          </div>
                      </div>
                    </div>
                ) : (
                    <ChangePasswordView onBack={() => setView('menu')} />
                )}
            </div>
        </Layout>
    );
};

export default SettingsPage;
