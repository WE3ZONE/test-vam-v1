'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockBlogPosts } from '@/data/mockBlog';

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-green-500/10 text-green-500',
  indigo: 'bg-indigo-500/10 text-indigo-500',
  teal: 'bg-teal-500/10 text-teal-500',
  red: 'bg-red-500/10 text-red-500',
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = mockBlogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto w-full px-4 py-16 text-center animate-fadeIn">
        <i className="fa-solid fa-newspaper text-3xl text-divar-muted mb-3" />
        <p className="text-divar-muted text-sm mb-4">مقاله یافت نشد</p>
        <Link href="/blog" className="text-brand-500 text-sm hover:underline cursor-pointer">بازگشت به وبلاگ</Link>
      </div>
    );
  }

  const related = mockBlogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 md:py-10 animate-fadeIn">
      <Link href="/blog" className="text-divar-muted hover:text-divar-text transition-colors flex items-center gap-2 mb-6 text-sm cursor-pointer w-fit">
        <i className="fa-solid fa-arrow-right group-hover:-translate-x-0.5 transition-transform" />
        بازگشت به وبلاگ
      </Link>

      {/* Hero image */}
      <div className="relative w-full h-52 md:h-72 rounded-2xl overflow-hidden mb-6 bg-divar-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
        <span className={`absolute top-3 right-3 ${colorClasses[post.color]} backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-md`}>{post.category}</span>
      </div>

      {/* Article header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-divar-text leading-relaxed mb-3">{post.title}</h1>
        <div className="flex items-center gap-4 text-xs text-divar-muted border-b border-divar-border pb-5">
          <span className="flex items-center gap-1"><i className="fa-regular fa-calendar" />{post.date}</span>
          <span className="flex items-center gap-1"><i className="fa-regular fa-clock" />{post.readTime} مطالعه</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 md:p-6 mb-8">
        <div className="space-y-4">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-sm text-divar-text leading-loose">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-5 mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-magnifying-glass text-brand-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-divar-text mb-0.5">به دنبال امتیاز وام هستید؟</p>
          <p className="text-xs text-divar-muted">آگهی‌های فعال را مشاهده کنید</p>
        </div>
        <Link href="/listings" className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex-shrink-0">
          مشاهده آگهی‌ها
        </Link>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-divar-text mb-4 flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-divar-muted" /> مقالات مرتبط
          </h2>
          <div className="space-y-3">
            {related.map(p => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="flex items-center gap-4 bg-divar-surface border border-divar-border rounded-2xl p-3 hover:border-brand-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-divar-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-divar-text group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">{p.title}</h3>
                  <span className="text-[11px] text-divar-muted">{p.readTime} مطالعه</span>
                </div>
                <i className="fa-solid fa-chevron-left text-divar-muted text-xs flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
