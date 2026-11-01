import Link from 'next/link';
import type { ComponentProps } from 'react';
import { isPublishedPath } from '@/lib/site-sections';
import { communityHomeRedirect } from '@/lib/community';

/** Suppress links to unpublished sections, including links in legacy content. */
export default function PublishedLink(props: ComponentProps<typeof Link>) {
    const href = typeof props.href === 'string' ? props.href : props.href.pathname || '';
    if (href && !isPublishedPath(href)) return null;
    const target = typeof props.href === 'string' ? communityHomeRedirect(props.href) : null;
    return <Link {...props} href={target || props.href} />;
}
