'use client';

import { usePathname } from 'next/navigation';

// Links and icons arrive as server-rendered children; no catalogue data is imported.
export function DnaTabLinks({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return <div className="dna-tab-links" data-active-path={pathname} ref={node => {
        node?.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
            if (link.getAttribute('href') === pathname) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }}>{children}</div>;
}
