module.exports = {
  apps : [
    {
      name      : 'onetag',
      script    : 'server.js',
      env: {
        ONETAG_MONGODB_CONNECTION: 'mongodb://admin:gdkHrqD3zQ82x38Z@13.229.110.135:27017/adtranonetag?authSource=admin',
        ONETAG_PORT: 80,
        ONETAG_INITKEY: 'microadonetag',
        ONETAG_CACHE_DURATION: 3600
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]
};
