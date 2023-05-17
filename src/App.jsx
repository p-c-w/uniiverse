import { RecoilRoot } from 'recoil';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useColorScheme from './hooks/useColorScheme';
import { Root, MyPage, SignIn, SignUp, EditProfile } from './pages';
import AuthenticationGuard from './guard/AuthenticationGuard';
import { colors } from './constants';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

const queryClient = new QueryClient({
  retry: 3,
});

const router = createBrowserRouter([
  {
    path: '/mypage',
    element: <AuthenticationGuard redirectTo="/signin" element={<MyPage />} />,
  },
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/editprofile',
    element: <AuthenticationGuard redirectTo="/signin" element={<EditProfile />} />,
  },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
]);

const App = () => {
  const [colorScheme, toggleColorScheme] = useColorScheme();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <ModalsProvider>
            <MantineProvider
              theme={{
                fontFamily: 'Spoqa Han Sans Neo, sans-serif',
                colorScheme,
                primaryColor: 'violet',
                colors,
              }}
              withCSSVariables
              withGlobalStyles
              withNormalizeCSS>
              <Notifications position="bottom-right" />
              <RouterProvider router={router} />
            </MantineProvider>
          </ModalsProvider>
        </ColorSchemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
