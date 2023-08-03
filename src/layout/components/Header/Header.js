import { useContext } from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import StoreContext from '../../../store/Context';
import { useLocation, useNavigate } from 'react-router';
import { IoLogOut } from 'react-icons/io5';
import config from '../../../config';
import { TbAlignLeft } from 'react-icons/tb';

const cx = classNames.bind(styles);
const defaultFc = () => {};
function Header({ toggleSideBar = defaultFc }) {
    const titles = {
        [config.routes.order]: 'Đơn hàng',
        [config.routes.staff]: 'Nhân viên',
        [config.routes.report]: 'Thống kê',
        [config.routes.ingredient]: 'Nguyên liệu',
        [config.routes.menu]: 'Menu',
        [config.routes.shop]: 'Cửa hàng',
        [config.routes.adminIngredient]: 'Nguyên liệu',
        [config.routes.adminMenu]: 'Menu',
        [config.routes.adminReport]: 'Thống kê',
    };
    const [state, dispatch] = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    const title = titles[location.pathname];
    const handleLogOut = () => {
        localStorage.clear();
        navigate(config.routes.login);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('greeting')}>
                    <TbAlignLeft className={cx('nav-actions')} onClick={() => toggleSideBar()} />
                    Chào {state.userInfo && state.userInfo.name}
                    {state.userInfo && (
                        <span>
                            ({state.userInfo.role === 1 ? 'Nhân viên' : state.userInfo.role === 2 ? 'Quản lý' : 'Admin'}
                            )
                        </span>
                    )}
                </div>
                <div onClick={handleLogOut} className={cx('actions')}>
                    Đăng xuất
                    <IoLogOut className={cx('icon')} />
                </div>
            </div>
            <div className={cx('page-route')}>Quản lý {title}</div>
        </div>
    );
}

export default Header;
