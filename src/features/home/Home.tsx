import { Link } from 'react-router-dom';

type MenuItem = {
  to: string;
  title: string;
  description: string;
  accent: string;
};

const menu: MenuItem[] = [
  {
    to: '/items',
    title: 'アイテム',
    description: 'アイテムの一覧・登録・編集',
    accent: 'bg-slate-800 hover:bg-slate-900',
  },
];

export function Home() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-2xl font-bold">メニュー</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex h-48 flex-col justify-between rounded-2xl p-8 text-white shadow-lg transition ${item.accent}`}
          >
            <span className="text-3xl font-bold">{item.title}</span>
            <span className="text-sm opacity-90">{item.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
