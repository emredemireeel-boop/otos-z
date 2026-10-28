import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from '../scripts/seo-quality-loader.mjs';
const { getForumIndexDecision } = loadSource('lib/forum-index-policy.ts');

const base = { title: 'Motor sıcaklığında dalgalanma', visibleEntryCount: 1,
    content: 'a'.repeat(200), data: {} };

test('200 görünür karakterli gerçek bir ileti indekslenebilir', () => {
    assert.equal(getForumIndexDecision(base).indexable, true);
});
test('199 karakterli tek ileti noindex olur', () => {
    assert.equal(getForumIndexDecision({ ...base, content: 'a'.repeat(199) }).indexable, false);
});
test('birkaç kısa yanıt toplam içeriği yeterli yapmaz', () => {
    assert.equal(getForumIndexDecision({ ...base, visibleEntryCount: 3, content: 'Kısa bir yanıt.' }).indexable, false);
});
test('eski entry sayacı görünür ileti yokluğunu örtemez', () => {
    assert.equal(getForumIndexDecision({ ...base, visibleEntryCount: 0 }).indexable, false);
});
test('spam şüphesi uzun içerikte de noindex üretir', () => {
    const result = getForumIndexDecision({ ...base, data: { moderationStatus: 'suspected_spam' } });
    assert.equal(result.indexable, false);
    assert.ok(result.reasons.includes('spam-moderation-signal'));
});
test('işaretleme ve görsel URL uzunluğu görünür içerik sayılmaz', () => {
    const content = `<b>Kısa</b> ![görsel](https://example.com/${'a'.repeat(300)})`;
    assert.equal(getForumIndexDecision({ ...base, content }).indexable, false);
});
