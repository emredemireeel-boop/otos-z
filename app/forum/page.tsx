import ForumHub, { forumHubMetadata } from './ForumHub';

export const revalidate = 900;
export const generateMetadata = () => forumHubMetadata();

export default function ForumPage() {
    return <ForumHub />;
}
