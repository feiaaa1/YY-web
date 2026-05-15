import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Compass, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: '首页', path: '/', icon: Sparkles },
    { name: '案例库', path: '/cases', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              全球营销<span className="text-indigo-600">案例库</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-indigo-600 py-2",
                    isActive ? "text-indigo-600" : "text-gray-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link 
              to="/cases" 
              className="hidden sm:flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <Search className="w-4 h-4" />
              搜索案例...
            </Link>
            
            {/* Mobile Menu Button (simplified for aesthetic) */}
            <div className="md:hidden flex items-center">
              <Link to="/cases" className="p-2 text-gray-600">
                <Compass className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
