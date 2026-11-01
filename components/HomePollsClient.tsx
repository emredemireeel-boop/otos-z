'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthUser } from '@/context/AuthContext';
import { clientDatabase } from '@/lib/client-services';
import { communitySurvey, type CommunitySurvey } from '@/lib/community';
import styles from './home-community.module.css';

export default function HomePollsClient({ polls, onCreate }: { polls: CommunitySurvey[]; onCreate: () => void }) {
    const user = useAuthUser();
    const [updates, setUpdates] = useState<Record<string, CommunitySurvey>>({});
    const [choices, setChoices] = useState<Record<string, number>>({});
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState('');

    async function vote(id: string, choice: number) {
        if (!user || busy) return;
        setBusy(id); setError('');
        try {
            const { db, doc, runTransaction } = await clientDatabase();
            const updated = await runTransaction(db, async transaction => {
                const ref = doc(db, 'surveys', id), snapshot = await transaction.get(ref);
                const data = snapshot.data();
                const poll = data && communitySurvey(id, data);
                if (!poll || poll.status !== 'active' || !poll.nominees.some(item => item.id === choice)) throw Error('Bu anket oylamaya açık değil.');
                const uid = String(user!.id), voters = data!.voters || {}, previous = voters[uid];
                if (previous === choice) return poll;
                const nominees = poll.nominees.map(item => ({ ...item, votes: Math.max(0, item.votes + (item.id === choice ? 1 : 0) - (item.id === previous ? 1 : 0)) }));
                const totalVotes = poll.totalVotes + (previous === undefined ? 1 : 0);
                transaction.update(ref, { nominees, totalVotes, voters: { ...voters, [uid]: choice } });
                return { ...poll, nominees, totalVotes };
            });
            setUpdates(previous => ({ ...previous, [id]: updated }));
            setChoices(previous => ({ ...previous, [id]: choice }));
        } catch (reason) { setError(reason instanceof Error ? reason.message : 'Oyunuz kaydedilemedi.'); }
        finally { setBusy(null); }
    }

    return <section className={styles.polls} aria-label="Topluluk anketleri">
        <div className={styles.heading}><h2>Topluluk anketleri</h2><button type="button" onClick={onCreate}>Anket oluştur</button></div>
        {error && <p role="alert">{error}</p>}
        {!polls.length && <p>Henüz anket yok. Topluluğun fikrini almak için ilk anketi oluşturun.</p>}
        {polls.map(original => { const poll = updates[original.id] || original; return <article className={styles.poll} id={`anket-${poll.id}`} key={poll.id}>
            <h3>{poll.title}</h3>{poll.description && <p>{poll.description}</p>}
            <div className={styles.options}>{poll.nominees.map(option => <button key={option.id} type="button" disabled={!user || !!busy || poll.status !== 'active'} aria-pressed={choices[poll.id] === option.id} onClick={() => void vote(poll.id, option.id)}>
                <span>{option.name}</span><span>{option.votes} oy{poll.totalVotes ? ` · %${Math.round(option.votes / poll.totalVotes * 100)}` : ''}</span>
            </button>)}</div>
            <small>{poll.totalVotes} oy · {poll.status === 'active' ? 'Oylamaya açık' : 'Oylama sona erdi'}</small>
            {!user && <p><Link href="/giris">Oy vermek için giriş yapın</Link></p>}
        </article>; })}
    </section>;
}
