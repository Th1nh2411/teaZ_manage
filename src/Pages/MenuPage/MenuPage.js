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
const cx = classNames.bind(styles);

function MenuPage() {
    const [loading, setLoading] = useState();
    const [menuType1, setMenuType1] = useState([]);
    const [menuType2, setMenuType2] = useState([]);
    const [menuType3, setMenuType3] = useState([]);
    const [menuType4, setMenuType4] = useState([]);
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

    return (
        <div className={cx('wrapper')}>
            {loading ? (
                <div className={cx('loader')}>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <Row>
                    {Array.from({ length: 4 }, (_, index) => (
                        <Col md={6} key={index}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        {/* <HiDocumentMinus className={cx('icon', 'warning')} /> */}
                                        {index === 0
                                            ? 'Thức uống'
                                            : index === 1
                                            ? 'Cà phê'
                                            : index === 2
                                            ? 'Trà'
                                            : 'Bakery'}
                                    </div>
                                    <div className={cx('content-subtitle')}>
                                        {index === 0
                                            ? menuType1.length
                                            : index === 1
                                            ? menuType2.length
                                            : index === 2
                                            ? menuType3.length
                                            : menuType4.length}{' '}
                                        món
                                    </div>
                                </div>
                                <div className={cx('content-body')}>
                                    {index === 0 ? (
                                        menuType1.length !== 0 ? (
                                            menuType1.map((item, index) => (
                                                <OrderItem
                                                    onUpdateRecipe={() => getMenuDataByType(1)}
                                                    data={item}
                                                    key={index}
                                                />
                                            ))
                                        ) : (
                                            <div className={cx('empty-order-wrapper')}>
                                                <Image src={images.emptyCart} className={cx('empty-order-img')} />
                                                <div className={cx('empty-order-title')}>Chưa có món nào</div>
                                            </div>
                                        )
                                    ) : index === 1 ? (
                                        menuType2.length !== 0 ? (
                                            menuType2.map((item, index) => (
                                                <OrderItem
                                                    onUpdateRecipe={() => getMenuDataByType(2)}
                                                    data={item}
                                                    key={index}
                                                />
                                            ))
                                        ) : (
                                            <div className={cx('empty-order-wrapper')}>
                                                <Image src={images.emptyCart} className={cx('empty-order-img')} />
                                                <div className={cx('empty-order-title')}>Chưa có món nào</div>
                                            </div>
                                        )
                                    ) : index === 2 ? (
                                        menuType3.length !== 0 ? (
                                            menuType3.map((item, index) => (
                                                <OrderItem
                                                    onUpdateRecipe={() => getMenuDataByType(3)}
                                                    data={item}
                                                    key={index}
                                                />
                                            ))
                                        ) : (
                                            <div className={cx('empty-order-wrapper')}>
                                                <Image src={images.emptyCart} className={cx('empty-order-img')} />
                                                <div className={cx('empty-order-title')}>Chưa có món nào</div>
                                            </div>
                                        )
                                    ) : menuType4.length !== 0 ? (
                                        menuType4.map((item, index) => (
                                            <OrderItem
                                                onUpdateRecipe={() => getMenuDataByType(4)}
                                                data={item}
                                                key={index}
                                            />
                                        ))
                                    ) : (
                                        <div className={cx('empty-order-wrapper')}>
                                            <Image src={images.emptyCart} className={cx('empty-order-img')} />
                                            <div className={cx('empty-order-title')}>Chưa có món nào</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}

export default MenuPage;
