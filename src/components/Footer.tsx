import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer
      className="border-t mt-auto"
      style={{ background: 'var(--ink-soft)', borderColor: 'var(--border)' }}
    >
      <div className="container mx-auto px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <img
                src="/icon_32x32.png"
                alt="YY logo"
                className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
              />
              <span
                className="font-bold text-lg tracking-tight"
                style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}
              >
                营销案例库
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              为您提供最前沿的全球营销案例，深入解析创意、策略与传播机制。
              助力品牌经理与广告人找到下一个增长点。
            </p>
          </div>

          <div>
            <h4
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }}
            >
              案例库
            </h4>
            <ul className="space-y-3">
              {[
                { label: '全部案例', href: '/cases' },
                { label: '视频广告', href: '/cases?type=video_ad' },
                { label: '整合营销', href: '/cases?type=integrated_campaign' },
                { label: 'KOL合作', href: '/cases?type=kol_collaboration' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }}
            >
              关于
            </h4>
            <ul className="space-y-3">
              {['关于我们', '联系合作', '加入我们', '隐私政策'].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}
          >
            © {new Date().getFullYear()} 全球营销案例库. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}
          >
            Powered by Supabase
          </p>
        </div>
      </div>
    </footer>
  );
};
