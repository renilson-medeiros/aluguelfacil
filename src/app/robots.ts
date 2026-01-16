import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = 'https://lugogestaodeimoveis.com.br';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/', '/checkout/'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
