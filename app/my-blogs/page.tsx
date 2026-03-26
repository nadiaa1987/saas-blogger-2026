"use client";

import { useEffect, useState } from "react";
import { Book, Send, AlertCircle } from "lucide-react";

interface Blog {
  id: string;
  name: string;
  url: string;
  niche: string;
}

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [testPostStatus, setTestPostStatus] = useState<Record<string, { status: 'sending' | 'success' | 'error', message: string }>>({});

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  const handleTestPost = async (blogId: string) => {
    setTestPostStatus(prev => ({ ...prev, [blogId]: { status: 'sending', message: 'Sending test post...' } }));

    try {
      const res = await fetch(`/api/blogs/${blogId}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Post from SaaS",
          content: "This is a test post sent from the Blogger SaaS platform.",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestPostStatus(prev => ({ ...prev, [blogId]: { status: 'success', message: 'Test post sent successfully!' } }));
      } else {
        setTestPostStatus(prev => ({ ...prev, [blogId]: { status: 'error', message: data.error || 'Failed to send test post' } }));
      }
    } catch (err) {
      setTestPostStatus(prev => ({ ...prev, [blogId]: { status: 'error', message: 'An unexpected error occurred.' } }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-8">
        <Book className="w-7 h-7 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">My Blogs</h1>
      </div>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-500">You haven't added any blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900 truncate">{blog.name}</h3>
                <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate block">
                  {blog.url}
                </a>
                <p className="text-xs text-gray-500 mt-2 bg-gray-100 px-2 py-1 rounded-full inline-block">{blog.niche}</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => handleTestPost(blog.id)}
                  disabled={testPostStatus[blog.id]?.status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {testPostStatus[blog.id]?.status === 'sending' ? 'Sending...' : 'Send Test Post'}
                </button>
                {testPostStatus[blog.id] && (
                  <div className={`mt-3 text-xs flex items-center gap-2 ${testPostStatus[blog.id].status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {testPostStatus[blog.id].status === 'error' && <AlertCircle className="w-4 h-4" />}
                    <span>{testPostStatus[blog.id].message}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
