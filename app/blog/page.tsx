'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockBlogPosts, blogCategories } from '@/data/mockBlog';

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-green-500/10 text-green-500',
  indigo: 'bg-indigo-500/10 text-indigo-500',
  teal: 'bg-teal-500/10 text-teal-500',
  red: 'bg-red-500/10 text-red-500',
};

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('همه');

  const sorted = useMemo(() => [...mockBlogPosts].sort((a, b) => b.id - a.id), []);
  const featured = sorted[0];

  const filtered = useMemo(() => {
    return sorted.slice(1).filter(post => {
      if (category !== 'همه' && post.category !== category) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!`${post.title} ${post.excerpt}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [sorted, search, category]);

  const searchedFeatured = search.trim() && !`${featured.title} ${featured.excerpt}`.toLowerCase().includes(search.trim().toLowerCase());

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-10 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-newspaper text-brand-500 text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-divar-text">وبلاگ وام‌اینجاست</h1>
          <p className="text-sm text-divar-muted mt-1">راهنما، آموزش و نکات مفید درباره خرید و فروش امتیاز وام</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="جستجو در مقالات..."
          className="w-full bg-divar-surface border border-divar-border text-divar-text rounded-2xl py-3.5 px-5 pl-12 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm text-sm"
        />
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-divar-muted" />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {blogCategories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border cursor-pointer ${
              category === c
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-divar-bg text-divar-muted border-divar-border hover:text-divar-text'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured post */}
      {!searchedFeatured && (category === 'همه' || category === featured.category) && (
        <Link
          href={`/blog/${featured.slug}`}
          className="block bg-divar-surface border border-divar-border rounded-2xl overflow-hidden mb-8 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-200 cursor-pointer group"
        >
          <div className="relative w-full h-48 md:h-64 overflow-hidden bg-divar-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                <i className="fa-solid fa-star" /> جدیدترین مقاله
              </span>
              <span className={`${colorClasses[featured.color]} backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-md`}>{featured.category}</span>
            </div>
          </div>
          <div className="p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-divar-text group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2 leading-relaxed">
              {featured.title}
            </h2>
            <p className="text-sm text-divar-muted leading-relaxed mb-4 line-clamp-2">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-divar-muted">
              <span className="flex items-center gap-1"><i className="fa-regular fa-calendar" />{featured.date}</span>
              <span className="flex items-center gap-1"><i className="fa-regular fa-clock" />{featured.readTime} مطالعه</span>
            </div>
          </div>
        </Link>
      )}

      {/* Recent posts list */}
      <h2 className="text-sm font-bold text-divar-text mb-4 flex items-center gap-2">
        <i className="fa-solid fa-clock-rotate-left text-divar-muted" /> مطالب اخیر
      </h2>

      {filtered.length === 0 ? (
        <div className="bg-divar-surface border border-divar-border rounded-2xl p-12 text-center">
          <i className="fa-solid fa-magnifying-glass text-3xl text-divar-muted mb-3" />
          <p className="text-divar-muted text-sm">مقاله‌ای با این مشخصات یافت نشد.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex items-start gap-4 bg-divar-surface border border-divar-border rounded-2xl p-3 hover:border-brand-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-divar-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`${colorClasses[post.color]} text-[10px] font-bold px-2 py-0.5 rounded`}>{post.category}</span>
                </div>
                <h3 className="text-sm font-bold text-divar-text group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1 line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-xs text-divar-muted line-clamp-2 mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-[11px] text-divar-muted">
                  <span className="flex items-center gap-1"><i className="fa-regular fa-calendar" />{post.date}</span>
                  <span className="flex items-center gap-1"><i className="fa-regular fa-clock" />{post.readTime}</span>
                </div>
              </div>
              <i className="fa-solid fa-chevron-left text-divar-muted text-xs flex-shrink-0 mt-1 self-center hidden sm:block" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
