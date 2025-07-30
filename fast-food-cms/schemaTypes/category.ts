// @ts-ignore
export default {
    name: 'category',
    title: 'Category',
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
            name: 'menu',
            title: 'Menu Items',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'menu' }] }]
        }
    ]
}
