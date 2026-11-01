import Link from 'next/link';
import type { ComponentProps } from 'react';
import { isPublishedPath } from '@/lib/site-sections';

/** Suppress links to unpublished sections, including links in legacy content. */
export default function PublishedLink(props: ComponentProps<typeof Link>) {
    const href = typeof props.href === 'string' ? props.href : props.href.pathname || '';
    if (href && !isPublishedPath(href)) return null;
    return <Link {...props} />;
}
