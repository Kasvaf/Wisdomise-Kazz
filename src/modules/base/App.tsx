import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';
import { RouterBaseName } from 'config/constants';
import 'tw-elements';
import useConfig from 'config/useConfig';
import useRoutes from './routes';
import './styles/App.css';

const App = () => {
  useConfig();

  const routes = useRoutes();
  const createRouter = RouterBaseName ? createHashRouter : createBrowserRouter;
  return <RouterProvider router={createRouter(routes)} />;
};

export default App;
