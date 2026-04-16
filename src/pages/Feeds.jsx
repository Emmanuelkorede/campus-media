import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Feeds() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    const { data: announcements } = await supabase
      .from("announcements")
      .select(`
        *,
        feed_likes ( user_id )
      `)
      .order("created_at", { ascending: false });

    const formatted = announcements?.map(post => ({
      ...post,
      likesCount: post.feed_likes?.length || 0,
      hasLiked: post.feed_likes?.some(l => l.user_id === user?.id)
    })) || [];

    setPosts(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, [user?.id]);

  const handleLike = async (postId, hasLiked) => {
    if (!user) return alert("Please login to like posts!");

    // Optimistic Update
    setPosts(current => current.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasLiked: !hasLiked,
          likesCount: hasLiked ? p.likesCount - 1 : p.likesCount + 1
        };
      }
      return p;
    }));

    if (hasLiked) {
      await supabase
        .from("feed_likes")
        .delete()
        .eq("announcement_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("feed_likes")
        .insert({ announcement_id: postId, user_id: user.id });
    }
    fetchFeeds();
  };

  return (
    <> 
    <Navbar />
    <div className="max-w-2xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Intelligence Feed</h1>
        </div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Exam Trends & Updates</p>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full tracking-widest border border-blue-100">
                {post.tag}
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-3">{post.title}</h2>
              <p className="text-slate-500 text-sm mt-1 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <button 
                  onClick={() => handleLike(post.id, post.hasLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    post.hasLiked 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  <span>{post.hasLiked ? "❤️" : "🤍"}</span>
                  <span className="tabular-nums">{post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>
                
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
          End of Feed
        </p>
      </div>
    </div>
    </>
  );
}