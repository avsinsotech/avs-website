// PM2 process file for the Next.js website (Linux or Windows).
//   cd frontend && npm ci && npm run build
//   cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
//   pm2 start ../deploy/ecosystem.config.js && pm2 save
module.exports = {
  apps: [{
    name: 'avs-website',
    cwd: __dirname + '/../frontend/.next/standalone',
    script: 'server.js',
    env: { NODE_ENV: 'production', PORT: 3000, HOSTNAME: '127.0.0.1' },
    instances: 1,
    max_memory_restart: '512M',
  }],
};
