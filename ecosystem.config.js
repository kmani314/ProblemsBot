module.exports = {
  apps: [
    {
      name: 'ProblemsBot',
      script: 'npm start',
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
      path: '/home/user/ProblemsBot',
      'pre-deploy-local': 'rm -rf /home/krishna/ProblemsBot',
      'post-deploy': 'pm2 reload ecosystem.config.js --env production',
    },
  },
};
