"use client";

import { useState } from "react";
import { Mail, Globe, Hash, ShieldCheck, Key, User } from "lucide-react";

export default function BloggerConnectionForm() {
  const [formData, setFormData] = useState({
    blogName: "",
    blogUrl: "",
    secretEmail: "",
    niche: "General",
    smtpEmail: "",
    smtpPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Blog connected successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to connect blog" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6 text-blue-600">
        <Mail className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Manual Connection (Email-to-Post)</h2>
      </div>

      <p className="text-sm text-gray-500 mb-8 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 mt-0.5 text-blue-400" />
        Use your Blogger "Secret Email" for automation without Google Cloud setup.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Blog Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="My Awesome Blog"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.blogName}
                onChange={(e) => setFormData({ ...formData, blogName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Blog URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                placeholder="https://myblog.blogspot.com"
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.blogUrl}
                onChange={(e) => setFormData({ ...formData, blogUrl: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Secret Blogger Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="username.secret@blogger.com"
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.secretEmail}
                onChange={(e) => setFormData({ ...formData, secretEmail: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Niche</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            SMTP Settings (Your Google Account)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Google Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="your-email@gmail.com"
                  className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.smtpEmail}
                  onChange={(e) => setFormData({ ...formData, smtpEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">App Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.smtpPassword}
                  onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Use a Google App Password, not your regular password.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
