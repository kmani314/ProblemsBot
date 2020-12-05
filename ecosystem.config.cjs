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
      user: 'krishna',
      host: 'sidmani.com',
      ref: 'origin/master',
      repo: 'https://github.com/kmani314/ProblemsBot',
      path: '/home/krishna/ProblemsBot',
      'pre-setup': 'rm -rf /home/krishna/ProblemsBot',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
