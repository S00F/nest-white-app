import { create, defaults, rewriter, router } from 'json-server';
import path from 'path';
import bodyParser from 'body-parser';
import rewrites from './routes.json';
import countries from './static/countries.json';

export function bootstrap() {
  const server = create();
  const apiEndpoints = router(path.join(__dirname, 'dbmocks.json'));
  const middlewares = defaults({
    logger: true,
    static: path.join(__dirname, 'static'),
  });

  server.post('/mocks/api/authenticate', (req, res) => {
    res.send('bearer token');
  });

  server.post('/mocks/api/countries', (req, res) => {
    res.json(countries);
  });

  server.use(rewriter(rewrites));
  server.use(middlewares);
  server.use(bodyParser.json());

  server.use('/mocks', apiEndpoints);
  return server;
}
