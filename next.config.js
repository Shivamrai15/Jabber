/** @type {import('next').NextConfig} */
const nextConfig = {
    images : {
        unoptimized : true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'files.edgestore.dev',
            },
            {
                protocol : "https",
                hostname : "avatars.githubusercontent.com"
            },
            {
                protocol : "https",
                hostname : "lh3.googleusercontent.com"
            }
        ],
    }
}

module.exports = nextConfig;
