import {Home, About, NotFound, Test, Dashboard, Auth, NotesDetail} from './pages';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from "@/components/theme-provider"
import Layout from './Layout.jsx';


import {createBrowserRouter, RouterProvider} from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'test',
                element: <Test />,
            },
            {
                path: 'auth',
                element: <Auth />,
            },
            {
                path: 'notes',
                element: <Dashboard />,
            },
            {

                path: 'notes/:id',
                element: <NotesDetail />,

            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]);

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
