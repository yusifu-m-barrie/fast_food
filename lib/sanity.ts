

// lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: '3gsom6u5', // from sanity.json or sanity.manage
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-07-29',
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);

