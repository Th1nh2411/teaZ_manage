import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './Routes';
import DefaultLayout from './layout/DefaultLayout';
import { Fragment, useContext, useEffect, useState } from 'react';
import config from './config';
import dayjs from 'dayjs';
import { StoreContext } from './store';

function App() {
    const [state, dispatch] = useContext(StoreContext);
    const titles = {
        [config.routes.login]: 'TeaZ - Đăng nhập',
        [config.routes.order]: 'TeaZ - Đơn hàng',
        [config.routes.staff]: 'TeaZ - Cửa hàng',
        [config.routes.ingredient]: 'TeaZ - Nguyên liệu',
        [config.routes.adminIngredient]: 'TeaZ - Nguyên liệu',
        [config.routes.menu]: 'TeaZ - Menu',
        [config.routes.adminMenu]: 'TeaZ - Menu',
        [config.routes.report]: 'TeaZ - Thống kê',
        [config.routes.adminReport]: 'TeaZ - Thống kê',
    };
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const expireDate = dayjs(localStorage.getItem('expireDate'));
        if (dayjs().isAfter(expireDate)) {
            localStorage.clear();
            alert('The login session has expired. Please log in again.');
            navigate(config.routes.login);
        }
        document.title = titles[location.pathname] ?? 'TeaZ - Manage';
    }, [location]);
    return (
        <div className="App">
            <Routes>
                {privateRoutes.map((route, index) => {
                    let Layout = DefaultLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    const Element = route.component;
                    return (
                        <Route
                            exact
                            key={index}
                            path={route.path}
                            element={
                                state.userInfo ? (
                                    <Layout>
                                        <Element />
                                    </Layout>
                                ) : (
                                    <Navigate to={config.routes.login} replace />
                                )
                            }
                        />
                    );
                })}
                {publicRoutes.map((route, index) => {
                    let Layout = DefaultLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    const Element = route.component;
                    return (
                        <Route
                            exact
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Element />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </div>
    );
}

export default App;
