# angular2-webpack-boilerplate

## Install
Clone repository, and make sure you have `npm` installed. Install all dependencies using `npm`.

```
npm install
```

## Development
The template uses the [webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html), supporting automatic refreshing and hot module replacement.

```
npm start
```

You can now visit your application on [http://localhost:8080](http://localhost:8080).

## Production
The `package.json` includes another build target that generates a `/dist` folder using webpack. The following command launches a barebones [expressjs](https://github.com/expressjs) server:

```
npm run production
```

You can also generate the `/dist` folder using `npm run build` and use a server like nginx to serve the site statically.


