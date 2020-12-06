module.exports = {
  apps: [
    {
      name: 'ProblemsBot',
      script: 'npm run start',
      autorestart: true,
      max_restarts: 25,
      watch: false,
      max_memory_restart: '500M',
    },
  ],

  deploy: {
    production: {
      user: process.env.deploy_user,
      host: process.env.deploy_host,
      ref: 'origin/master',
      repo: 'https://github.com/kmani314/ProblemsBot',
      path: process.env.deploy_path,
      'post-deploy': `npm install && npm run botConfig ${process.env.bot_key} ${process.env.db_string} && pm2 startOrRestart ecosystem.config.cjs`,
    },
  },
};
