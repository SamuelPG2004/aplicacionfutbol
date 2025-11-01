module.exports = {
  apps: [
    {
      name: "aplicacionfutbol",
      script: "server.js",
      cwd: __dirname,
      // Ajusta variables de entorno según necesites; .env seguirá aplicando si está presente
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000
    }
  ]
};
