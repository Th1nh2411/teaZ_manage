import styles from './MenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as menuService from '../../services/menuService';
import { StoreContext, actions } from '../../store';
import LocalStorageManager from '../../utils/LocalStorageManager';
import Tippy from '@tippyjs/react';
import OrderItem from '../../components/OrderItem/OrderItem';
import { SiBuymeacoffee, SiCakephp } from 'react-icons/si';
import { GiCoffeeBeans } from 'react-icons/gi';
import { TbLemon, TbPaperBag } from 'react-icons/tb';
const cx = classNames.bind(styles);

function MenuPage() {
    const [loading, setLoading] = useState();
    const [menuType1, setMenuType1] = useState([]);
    const [menuType2, setMenuType2] = useState([]);
    const [menuType3, setMenuType3] = useState([]);
    const [menuType4, setMenuType4] = useState([]);
    const [allTopping, setAllTopping] = useState();
    const localStorageManage = LocalStorageManager.getInstance();
    const getMenuDataByType = async (idType) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            setLoading(true);
            const results = await menuService.getMenuByType(idType, token);
            if (results && results.isSuccess) {
                idType === 1
                    ? setMenuType1(results.menu)
                    : idType === 2
                    ? setMenuType2(results.menu)
                    : idType === 3
                    ? setMenuType3(results.menu)
                    : setMenuType4(results.menu);
            }
            setLoading(false);
        }
    };
    useEffect(() => {
        getMenuDataByType(1);
        getMenuDataByType(2);
        getMenuDataByType(3);
        getMenuDataByType(4);
    }, []);
    const getAllTopping = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await menuService.getMenuByType(7, token);
            if (results && results.isSuccess) {
                setAllTopping(results.menu);
            }
        }
    };
    useEffect(() => {
        getAllTopping();
    }, []);
    return (
        <div className={cx('wrapper')}>
            {loading ? (
                <div className={cx('loader')}>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <Row>
                    <Col md={6}>
                        <ContentWrapper
                            titleIcon={<SiBuymeacoffee className={cx('icon')} />}
                            menu={menuType1}
                            title="Thức uống"
                        />
                    </Col>
                    <Col md={6}>
                        <ContentWrapper
                            titleIcon={<GiCoffeeBeans className={cx('icon')} />}
                            menu={menuType2}
                            title="Cà phê"
                        />
                    </Col>
                    <Col md={6}>
                        <ContentWrapper
                            titleIcon={<TbPaperBag className={cx('icon')} />}
                            menu={menuType3}
                            title="Trà túi"
                        />
                    </Col>
                    <Col md={6}>
                        <ContentWrapper
                            titleIcon={<SiCakephp className={cx('icon')} />}
                            menu={menuType4}
                            title="Bakery"
                        />
                    </Col>
                    <Col md={6}>
                        <ContentWrapper
                            titleIcon={<TbLemon className={cx('icon')} />}
                            menu={allTopping}
                            title="Topping"
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
}
function ContentWrapper({ title, titleIcon, menu }) {
    return (
        <div className={cx('content-wrapper')}>
            <div className={cx('content-header')}>
                <div className={cx('content-title')}>
                    {/* <HiDocumentMinus className={cx('icon', 'warning')} /> */}
                    <div className={cx('content-tab', 'active')}>
                        {titleIcon}
                        {title}
                    </div>
                </div>
                <div className={cx('content-subtitle')}>{menu && menu.length} món</div>
            </div>
            <div className={cx('content-body')}>
                <div className={cx('content-pane', 'active')}>
                    {menu && menu.length !== 0 ? (
                        menu.map((item, index) => <OrderItem data={item} key={index} />)
                    ) : (
                        <div className={cx('empty-order-wrapper')}>
                            <Image src={images.emptyCart} className={cx('empty-order-img')} />
                            <div className={cx('empty-order-title')}>Chưa có món nào</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MenuPage;
