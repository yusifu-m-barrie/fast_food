// lib/sanityQueries.ts
import { client, urlFor } from "./sanity";

export const fetchCategories = async () => {
    const query = `*[_type == "category"]{_id, name, description}`;
    return await client.fetch(query);
};

export const fetchCustomizations = async () => {
    const query = `*[_type == "customization"]{_id, name, price, type}`;
    return await client.fetch(query);
};

export const fetchMenuItems = async ({
                                         category,
                                         query,
                                     }: {
    category?: string;
    query?: string;
}) => {
    let filters = [];

    // Match category reference name
    if (category) {
        filters.push(`category->name == "${category}"`);
    }

    // Match name search
    if (query) {
        filters.push(`name match "*${query}*"`);
    }

    const whereClause =
        filters.length > 0 ? `*[_type == "menu" && ${filters.join(" && ")}]` : `*[_type == "menu"]`;

    const groqQuery = `${whereClause}{
    _id,
    name,
    description,
    price,
    rating,
    calories,
    protein,
    image,
    category->{name},
    customizations[]->{name, price, type}
  }`;

    const result = await client.fetch(groqQuery);

    return result
        .filter((item: any) => item._id)
        .map((item: any) => ({
            ...item,
            image: item.image ? urlFor(item.image).url() : null,
        }));
};
