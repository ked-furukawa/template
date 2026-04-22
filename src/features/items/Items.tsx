import { useEffect, useState } from 'react';
import type { Schema } from '../../../amplify/data/resource';
import { getDataClient } from '@/shared/lib/amplify';

type Item = Schema['Item']['type'];

type FormState = {
  name: string;
  note: string;
};

const EMPTY_FORM: FormState = { name: '', note: '' };

export function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    try {
      setLoading(true);
      const client = getDataClient();
      const { data, errors } = await client.models.Item.list();
      if (errors?.length) {
        setError(errors.map((e) => e.message).join(', '));
        return;
      }
      setItems(data ?? []);
      setError(null);
    } catch (e) {
      setError(`取得に失敗しました: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function startEdit(item: Item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      note: item.note ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const name = form.name.trim();
    if (!name) {
      setError('名前を入力してください。');
      return;
    }
    setSubmitting(true);
    try {
      const client = getDataClient();
      const note = form.note.trim() || null;
      if (editingId) {
        const { errors } = await client.models.Item.update({
          id: editingId,
          name,
          note,
        });
        if (errors?.length) throw new Error(errors.map((e) => e.message).join(', '));
      } else {
        const { errors } = await client.models.Item.create({
          name,
          note,
        });
        if (errors?.length) throw new Error(errors.map((e) => e.message).join(', '));
      }
      cancelEdit();
      await refresh();
    } catch (e) {
      setError(`保存に失敗しました: ${(e as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(target: Item) {
    if (!window.confirm(`「${target.name}」を削除します。よろしいですか?`)) return;
    setError(null);
    setSubmitting(true);
    try {
      const client = getDataClient();
      const { errors } = await client.models.Item.delete({ id: target.id });
      if (errors?.length) throw new Error(errors.map((e) => e.message).join(', '));
      await refresh();
    } catch (e) {
      setError(`削除に失敗しました: ${(e as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">アイテム</h1>

      {error && (
        <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">
          {editingId ? 'アイテムを編集' : '新しいアイテムを追加'}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">名前</span>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="アイテム名"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">メモ(任意)</span>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="補足情報"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-slate-800 px-4 py-3 text-base font-bold text-white shadow hover:bg-slate-900 disabled:opacity-50"
            >
              {editingId ? '更新' : '追加'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={submitting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold">登録済みアイテム</h2>
        </div>
        {loading ? (
          <div className="px-6 py-8 text-center text-slate-500">読み込み中…</div>
        ) : items.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-500">
            アイテムがまだ登録されていません。
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-semibold">{item.name}</div>
                  {item.note && (
                    <div className="mt-1 text-sm text-slate-600">{item.note}</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    disabled={submitting}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={submitting}
                    className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
