import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from '../scripts/seo-quality-loader.mjs';
const { forumPageWindow, isForumCategoryIndexable } = loadSource('lib/forum-pagination.ts');

test('13 gerçek başlık bir sayfaya sığar; olmayan ikinci sayfa reddedilir', () => {
    assert.deepEqual(forumPageWindow(13, 1), { pages: 1, start: 0, end: 13 });
    assert.equal(forumPageWindow(13, 2), null);
});
test('20 başlıkta ikinci sayfa açılmaz', () => {
    assert.deepEqual(forumPageWindow(20, 1), { pages: 1, start: 0, end: 20 });
    assert.equal(forumPageWindow(20, 2), null);
});
test('21 başlıkta ikinci sayfa yalnızca son başlığı gösterir', () => {
    assert.deepEqual(forumPageWindow(21, 2), { pages: 2, start: 20, end: 21 });
});
test('bilinen boş kategorinin ilk sayfası açılır; geçersiz sayılar reddedilir', () => {
    assert.deepEqual(forumPageWindow(0, 1), { pages: 1, start: 0, end: 0 });
    for (const page of [0, -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.equal(forumPageWindow(13, page), null);
});
test('kategori indeks eşiği dört ve beş başlık arasında değişir', () => {
    assert.equal(isForumCategoryIndexable(4), false);
    assert.equal(isForumCategoryIndexable(5), true);
});
