import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "IronBackend",
    description: "Backend Architecture Intelligence for AI Coding Assistants",
    themeConfig: {
        logo: '/logo.svg', // We'll need to create this or use a placeholder
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'Reference', link: '/reference/cli' }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: 'Introduction',
                    items: [
                        { text: 'Getting Started', link: '/guide/getting-started' },
                        { text: 'Philosophy', link: '/guide/philosophy' }
                    ]
                },
                {
                    text: 'Core Concepts',
                    items: [
                        { text: 'Architecture Styles', link: '/guide/architecture-styles' },
                        { text: 'Design Rules', link: '/guide/design-rules' }
                    ]
                }
            ],
            '/reference/': [
                {
                    text: 'API Reference',
                    items: [
                        { text: 'CLI Commands', link: '/reference/cli' },
                        { text: 'Configuration', link: '/reference/config' }
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/ironbackend/ironbackend' }
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024 IronBackend Contributors'
        }
    }
})
