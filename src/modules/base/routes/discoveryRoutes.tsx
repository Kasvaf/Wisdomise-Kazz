import { type Params, type RouteObject } from 'react-router-dom';
import PageDiscovery from 'modules/discovery/PageDiscovery';
import Container from '../Container';
import { useMenuItems } from '../Layout/MenuItems/useMenuItems';

const useDiscoveryRoutes = () => {
  const menuItems = useMenuItems();
  return [
    {
      element: <Container />,
      path: 'discovery',
      children: [
        {
          path: ':list',
          element: <PageDiscovery />,
          handle: {
            crumb: (p: Params<string>) =>
              menuItems.find(x => x.key === p.list)?.text,
          },
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useDiscoveryRoutes;
