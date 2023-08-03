import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './Routes';
import DefaultLayout from './layout/DefaultLayout';
import { Fragment, useEffect, useState } from 'react';
import config from './config';
import dayjs from 'dayjs';
import LocalStorageManager from './utils/LocalStorageManager';

function App() {
    const titles = {
        [config.routes.login]: 'Phúc Long - Đăng nhập',
        [config.routes.order]: 'Phúc Long - Đơn hàng',
        [config.routes.staff]: 'Phúc Long - Cửa hàng',
        [config.routes.ingredient]: 'Phúc Long - Nguyên liệu',
        [config.routes.adminIngredient]: 'Phúc Long - Nguyên liệu',
        [config.routes.menu]: 'Phúc Long - Menu',
        [config.routes.adminMenu]: 'Phúc Long - Menu',
        [config.routes.report]: 'Phúc Long - Thống kê',
        [config.routes.adminReport]: 'Phúc Long - Thống kê',
    };
    const location = useLocation();
    const navigate = useNavigate();
    const localStorageManage = LocalStorageManager.getInstance();
    useEffect(() => {
        const expireDate = dayjs(localStorage.getItem('expireDate'));
        if (dayjs().isAfter(expireDate)) {
            localStorage.clear();
            alert('The login session has expired. Please log in again.');
            navigate(config.routes.login);
        }
        localStorage.getItem('token');
        document.title = titles[location.pathname] ?? 'Phúc Long - Manage';
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
                                localStorageManage.getItem('token') ? (
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
