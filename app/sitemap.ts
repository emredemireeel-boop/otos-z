import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.otosoz.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/haberler`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/kutuphane`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/uzmana-sor`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/forum`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.8,
        }
    ];

    // 1. Haberler (News)
    try {
        const newsPath = path.join(process.cwd(), 'public', 'data', 'news_posts.json');
        if (fs.existsSync(newsPath)) {
            const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
            if (newsData.posts && Array.isArray(newsData.posts)) {
                newsData.posts.forEach((post: any) => {
                    sitemapEntries.push({
                        url: `${BASE_URL}/haberler/${post.slug}`,
                        lastModified: new Date(post.createdAt || new Date()),
                        changeFrequency: 'weekly',
                        priority: 0.8,
                    });
                });
            }
        }
    } catch (error) {
        console.error("Error generating news sitemap:", error);
    }

    // 2. Kütüphane Rehberleri (Library Guides)
    try {
        const libraryPath = path.join(process.cwd(), 'public', 'data', 'library_guides.json');
        if (fs.existsSync(libraryPath)) {
            const libraryData = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
            if (libraryData.guides && Array.isArray(libraryData.guides)) {
                libraryData.guides.forEach((guide: any) => {
                    sitemapEntries.push({
                        url: `${BASE_URL}/kutuphane/rehber/${guide.id}`,
                        lastModified: new Date(), // Guides static content
                        changeFrequency: 'monthly',
                        priority: 0.7,
                    });
                });
            }
        }
    } catch (error) {
        console.error("Error generating library sitemap:", error);
    }

    return sitemapEntries;
}
