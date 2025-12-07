import { RouterBaseName } from 'config/constants';
import useConfig from 'config/useConfig';
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';
import useRoutes from './routes';
import 'styles/index.css';

const App = () => {
  useConfig();
  const routes = useRoutes();
  const createRouter = RouterBaseName ? createHashRouter : createBrowserRouter;
  return <RouterProvider router={createRouter(routes)} />;
};

export default App;
