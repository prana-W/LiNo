import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, Signup, Login, About } from './pages';
import Layout from './Layout';

function App() {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [

                {
                    path: '',
                    element: <Home/>,
                },
                {
                    path: '/signup',
                    element: <Signup/>,
                },
                {
                    path: '/login',
                    element: <Login/>,
                },
                {
                    path: '/about',
                    element: <About/>,
                },

            ]
        }
    ]);

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
