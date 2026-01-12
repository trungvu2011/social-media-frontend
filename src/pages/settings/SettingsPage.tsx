import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { sendOTPChangePassword, changePassword } from "../../utils";
import { Lock, Mail, Key, ShieldCheck, ChevronRight, ArrowLeft, Settings as SettingsIcon } from "lucide-react";

// Sub-component for Change Password Flow
const ChangePasswordView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
      setError("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới không khớp.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      setLoading(true);
      const res = await sendOTPChangePassword();
      setOtpToken(res.otpToken);
      setSuccess("Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
    } catch (err: any) {
      setError(err?.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otpToken) {
      setError("Phiên làm việc hết hạn, vui lòng lấy lại mã OTP.");
      setStep(1);
      return;
    }
    if (!formData.otp) {
      setError("Vui lòng nhập mã OTP.");
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
      setSuccess("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
      setStep(1);
      setOtpToken(null);
    } catch (err: any) {
      setError(err?.message || "Đổi mật khẩu thất bại.");
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
                Đổi mật khẩu
            </h2>
        </div>
        
        <div className="p-6">
            <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    Để bảo vệ tài khoản, chúng tôi yêu cầu xác thực 2 bước (2FA) qua email khi đổi mật khẩu.
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
                    Mật khẩu hiện tại
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
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
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
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
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
                      placeholder="Nhập lại mật khẩu mới"
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
                        Tiếp tục (Gửi OTP) <Mail className="w-4 h-4" />
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
                    <h3 className="text-lg font-medium text-gray-900">Xác thực OTP</h3>
                    <p className="text-sm text-gray-500">
                        Mã xác thực đã được gửi đến email của bạn.
                    </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-center text-gray-700 mb-2">
                    Nhập mã OTP (6 số)
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
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                     {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        "Xác nhận đổi mật khẩu"
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
    const [view, setView] = useState<'menu' | 'change_password'>('menu');

    return (
        <Layout>
            <div className="max-w-2xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-indigo-600" />
                    Cài đặt & Quyền riêng tư
                </h1>

                {view === 'menu' ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-semibold text-gray-700">Tài khoản</h2>
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
                                        <div className="font-medium text-gray-900">Đổi mật khẩu</div>
                                        <div className="text-sm text-gray-500">Cập nhật mật khẩu và bảo mật</div>
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
                                        <div className="font-medium text-gray-900">Quyền riêng tư (Sắp ra mắt)</div>
                                        <div className="text-sm text-gray-500">Quản lý ai có thể thấy bài viết của bạn</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
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
