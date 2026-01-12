import { useState } from "react";
import { Loader } from "lucide-react";
import SocialHubLogo from "../../assets/socialhub-horizontal.png";
import { api } from "../../utils";
import { useTranslation } from "react-i18next";

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { message } = await api<{ message: string }>(
        `/users/forgot-password`,
        {
          method: "POST",
          body: { email },
        }
      );
      setMessage(message || t("Auth.Success.ResetLinkSent"));
    } catch (err: any) {
      setError(
        err.message || t("Auth.Error.Generic")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={SocialHubLogo} alt="SocialHub" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("Auth.ForgotPassword")}
          </h1>
          <p className="text-gray-600">
            {t("Auth.ForgotPasswordSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {t("Auth.Email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
          </div>

          {message && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {t("Auth.Sending")}
              </>
            ) : (
              t("Auth.SendResetLink")
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {t("Auth.BackToLogin")}{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {t("Login")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
