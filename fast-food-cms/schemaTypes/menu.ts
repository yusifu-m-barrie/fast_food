export default {
    name: 'menu',
    title: 'Menu Item',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: { required: () => any; }) => Rule.required()
        },
        {
            name: 'description',
            title: 'Description',
            type: 'string',
            validation: (Rule: { required: () => any; }) => Rule.required()
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true }
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number'
        },
        {
            name: 'rating',
            title: 'Rating',
            type: 'number'
        },
        {
            name: 'calories',
            title: 'Calories',
            type: 'number'
        },
        {
            name: 'protein',
            title: 'Protein',
            type: 'number'
        },
        {
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }]
        },
        {
            name: 'customizations',
            title: 'Customizations',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'customization' }] }]
        }
    ]
}
