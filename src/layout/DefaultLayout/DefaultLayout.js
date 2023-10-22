import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StoreContext, actions } from '../../store';
import config from '../../config';
import { useLocation } from 'react-router';
import SideBar from '../components/SideBar';
import Header from '../components/Header/Header';
const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
    const [state, dispatch] = useContext(StoreContext);
    const [sideBarShrink, setSideBarShrink] = useState(false);
    const [mobileMode, setMobileMode] = useState(false);
    const currentPath = useLocation().pathname;
    const root_theme = document.querySelector(':root');

    const handleToggleSideBar = () => {
        setSideBarShrink(!sideBarShrink);
    };
    useEffect(() => {
        if (sideBarShrink) {
            if (!mobileMode) {
                root_theme.style.setProperty('--sidebar-width', '64px');
            } else {
                root_theme.style.setProperty('--sidebar-width', '0px');
            }
        } else {
            root_theme.style.setProperty('--sidebar-width', '250px');
        }
    }, [sideBarShrink, mobileMode]);
    useEffect(() => {
        function updateSize() {
            if (window.innerWidth < 892) {
                // setSideBarShrink(true);
                setMobileMode(true);
            } else {
                setMobileMode(false);
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    const overlayRef = useRef();
    const handleDocumentClick = (event) => {
        if (overlayRef.current && overlayRef.current.contains(event.target)) {
            setSideBarShrink(true);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);
    return (
        <>
            <div className={cx('wrapper')}>
                {mobileMode && !sideBarShrink && <div ref={overlayRef} className={cx('overlay')}></div>}
                <SideBar sideBarShrink={sideBarShrink} />
                <div className={cx('container')}>
                    <Header toggleSideBar={handleToggleSideBar} />
                    <div className={cx('content')}>{children}</div>
                </div>
            </div>
        </>
    );
}
DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default DefaultLayout;
