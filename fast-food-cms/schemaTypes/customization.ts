export default {
    name: 'customization',
    title: 'Customization',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: { required: () => any; }) => Rule.required()
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule: { required: () => any; }) => Rule.required()
        },
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: ['topping', 'side'],
                layout: 'radio'
            },
            validation: (Rule: { required: () => any; }) => Rule.required()
        }
    ]
}
