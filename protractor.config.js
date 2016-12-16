exports.config = {
  baseUrl: 'http://localhost:8080/',
  specs: ['dist/tests/**/**.e2e.js'],
  directConnect: true,
  capabilities: {
    browserName: 'chrome'
  },
  useAllAngular2AppRoots: true
};