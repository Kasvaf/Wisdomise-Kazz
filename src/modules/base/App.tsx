import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';
import { RouterBaseName } from 'config/constants';
import 'tw-elements';
import routes from './routes';
import useAnalytics from './useAnalytics';
import './styles/App.css';

const App = () => {
  useAnalytics();
  const createRouter = RouterBaseName ? createHashRouter : createBrowserRouter;
  return <RouterProvider router={createRouter(routes)} />;
};

export default App;
