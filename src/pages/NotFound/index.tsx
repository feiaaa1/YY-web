import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--ink)' }}>
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--ink-muted)' }}>404</h1>
        <p className="text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>页面不存在</p>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          您访问的页面不存在或已被移动
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', color: 'var(--ink)' }}
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
