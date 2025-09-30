import NavBar from './components/navbar.jsx';
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <>

            <NavBar />
            <Outlet/>

        </>
    )
}

export default Layout;