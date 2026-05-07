import { Link } from 'react-router-dom';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

type MenuItem = {
  to: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const menu: MenuItem[] = [
  {
    to: '/items',
    title: 'アイテム',
    description: 'アイテムの一覧・登録・編集',
    icon: Squares2X2Icon,
  },
];

export function Home() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-2xl font-bold text-stone-900">メニュー</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex h-48 flex-col justify-between rounded-xl border border-stone-200/70 bg-stone-50 p-8 text-stone-800 transition-colors hover:bg-stone-100"
            >
              <Icon className="h-8 w-8 text-stone-500" aria-hidden="true" />
              <div className="space-y-1">
                <span className="block text-3xl font-bold text-stone-900">
                  {item.title}
                </span>
                <span className="block text-sm text-stone-600">
                  {item.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
