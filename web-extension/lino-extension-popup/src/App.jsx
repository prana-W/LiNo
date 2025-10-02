import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home, Signup, Login } from './pages';
import Layout from './Layout';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Home />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="login" element={<Login />} />
                    {/* Add other routes here */}
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;
