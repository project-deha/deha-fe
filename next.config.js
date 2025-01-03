/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.png$/,
            use: [{
                loader: 'url-loader',
                options: {
                    mimetype: 'image/png'
                }
            }]
        })
        return config
    }
}

module.exports = nextConfig

