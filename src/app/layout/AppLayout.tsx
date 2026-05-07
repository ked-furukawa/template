import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  Squares2X2Icon,
  Bars3Icon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

/* ------------------------------------------------------------------ */
/*  ナビゲーション定義                                                 */
/* ------------------------------------------------------------------ */
type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { to: '/', label: 'ホーム', icon: HomeIcon },
  { to: '/items', label: 'アイテム', icon: Squares2X2Icon },
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
type Props = {
  children: ReactNode;
};

/* ------------------------------------------------------------------ */
/*  AppLayout                                                          */
/* ------------------------------------------------------------------ */
export function AppLayout({ children }: Props) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100">
      {/* ---------- サイドバー ---------- */}
      <aside
        className={`flex flex-col border-r border-stone-200/70 bg-stone-50 text-stone-700 transition-[width] duration-200 ${
          expanded ? 'w-56' : 'w-16'
        }`}
      >
        {/* ヘッダー(トグルボタン) */}
        <div className="flex h-14 items-center">
          {expanded && (
            <div className="flex flex-1 items-center px-4 text-sm font-bold text-stone-800">
              Tablet PWA
            </div>
          )}
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className={`flex h-14 items-center justify-center text-stone-600 hover:bg-stone-100 ${
              expanded ? 'w-14' : 'w-full'
            }`}
            aria-label={expanded ? 'メニューを閉じる' : 'メニューを開く'}
          >
            {expanded ? (
              <ChevronLeftIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* ナビゲーションリンク */}
        <nav className="mt-2 flex flex-1 flex-col gap-1 px-2">
          {navItems.map((item) => {
            const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                className={`flex items-center gap-3 rounded-lg px-2 py-3 transition-colors ${
                  active
                    ? 'bg-stone-800 font-semibold text-stone-50'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                {expanded && (
                  <span className="truncate text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* サイドバー下部スペーサー */}
        <div className="border-t border-stone-200/70 px-2 py-3" />
      </aside>

      {/* ---------- メインエリア ---------- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="flex h-14 items-center justify-between border-b border-stone-200/70 bg-stone-50 px-6">
          <h1 className="text-lg font-semibold text-stone-800">Tablet PWA Template</h1>
          <span className="text-sm text-stone-500" />
        </header>

        {/* コンテンツ */}
        <main className="flex-1 overflow-y-auto bg-stone-100 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
