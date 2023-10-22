import styles from './MenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as menuService from '../../services/menuService';
import * as adminService from '../../services/adminService';
import { StoreContext, actions } from '../../store';
import Tippy from '@tippyjs/react';
import OrderItem from '../../components/OrderItem/OrderItem';
import { SiBuymeacoffee, SiCakephp } from 'react-icons/si';
import { GiCoffeeBeans } from 'react-icons/gi';
import { TbLemon, TbPaperBag } from 'react-icons/tb';
import HeadlessTippy from '@tippyjs/react/headless';
import { priceFormat } from '../../utils/format';
import Input from '../../components/Input/Input';
const cx = classNames.bind(styles);

function MenuPage() {
    const [loading, setLoading] = useState();
    const [menuType1, setMenuType1] = useState([]);
    const [menuType2, setMenuType2] = useState([]);
    const [menuType3, setMenuType3] = useState([]);
    const [menuType4, setMenuType4] = useState([]);
    const [allTopping, setAllTopping] = useState();
    const [listToppingByType, setListToppingByType] = useState();
    const getMenuDataByType = async (idType) => {
        setLoading(true);
        const results = await menuService.getMenuByType(idType);
        if (results) {
            idType === 1
                ? setMenuType1(results.menu)
                : idType === 2
                ? setMenuType2(results.menu)
                : idType === 3
                ? setMenuType3(results.menu)
                : setMenuType4(results.menu);
        }
        setLoading(false);
    };
    useEffect(() => {
        getMenuDataByType(1);
        getMenuDataByType(2);
        getMenuDataByType(3);
        getMenuDataByType(4);
    }, []);
    const getListToppingByType = async () => {
        const results = await adminService.getListToppingByType();
        if (results) {
            setListToppingByType(results.listType);
        }
    };
    useEffect(() => {
        getListToppingByType();
    }, []);
    const getAllTopping = async () => {
        const results = await menuService.getMenuByType(5);
        if (results) {
            setAllTopping(results.menu);
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
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            idType={1}
                            onUpdateTopping={async () => await getListToppingByType()}
                            topping={
                                listToppingByType && listToppingByType.find((type) => type.idType === 1).listToppings
                            }
                            titleIcon={<SiBuymeacoffee className={cx('icon')} />}
                            menuData={menuType1}
                            title="Thức uống"
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            idType={2}
                            onUpdateTopping={async () => await getListToppingByType()}
                            topping={
                                listToppingByType && listToppingByType.find((type) => type.idType === 2).listToppings
                            }
                            titleIcon={<GiCoffeeBeans className={cx('icon')} />}
                            menuData={menuType2}
                            title="Cà phê"
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            idType={3}
                            onUpdateTopping={async () => await getListToppingByType()}
                            topping={
                                listToppingByType && listToppingByType.find((type) => type.idType === 3).listToppings
                            }
                            titleIcon={<TbPaperBag className={cx('icon')} />}
                            menuData={menuType3}
                            title="Trà túi"
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            idType={4}
                            onUpdateTopping={async () => await getListToppingByType()}
                            topping={
                                listToppingByType && listToppingByType.find((type) => type.idType === 4).listToppings
                            }
                            titleIcon={<SiCakephp className={cx('icon')} />}
                            menuData={menuType4}
                            title="Bakery"
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            idType={1}
                            onUpdateTopping={async () => await getListToppingByType()}
                            titleIcon={<TbLemon className={cx('icon')} />}
                            menuData={allTopping}
                            title="Topping"
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
}
function ContentWrapper({ title, titleIcon, menuData, topping }) {
    const [tab, setTab] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [menu, setMenu] = useState(menuData);
    useEffect(() => {
        setMenu(menuData);
    }, [menuData]);
    return (
        <div className={cx('content-wrapper')}>
            <div className={cx('content-header')}>
                <div className={cx('content-title')}>
                    {/* <HiDocumentMinus className={cx('icon', 'warning')} /> */}
                    <div className={cx('content-tab', { active: tab === 0 })} onClick={() => setTab(0)}>
                        {titleIcon}
                        {title}
                    </div>
                    {topping && (
                        <div className={cx('content-tab', 'extra', { active: tab === 1 })} onClick={() => setTab(1)}>
                            Topping
                        </div>
                    )}
                </div>
                <Input
                    title={'Tìm món ăn'}
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                        setMenu(
                            menuData.filter((item) => item.name.toUpperCase().includes(e.target.value.toUpperCase())),
                        );
                    }}
                />
                <div className={cx('content-subtitle')}>
                    {tab === 0 ? menu && menu.length : topping && topping.length} món
                </div>
            </div>
            <div className={cx('content-body')}>
                <div className={cx('content-pane', { active: tab === 0 })}>
                    {menu && menu.length !== 0 ? (
                        menu.map((item, index) => <OrderItem data={item} key={index} />)
                    ) : (
                        <div className={cx('empty-order-wrapper')}>
                            <Image src={images.emptyCart} className={cx('empty-order-img')} />
                            <div className={cx('empty-order-title')}>Chưa có món nào</div>
                        </div>
                    )}
                </div>
                <div className={cx('content-pane', { active: tab === 1 })}>
                    {topping && topping.length !== 0 ? (
                        topping.map((item, index) => (
                            <div key={index} className={cx('recipe-item', { inactive: item.isDel })}>
                                <div className={cx('recipe-content')}>
                                    <div className={cx('recipe-img-wrapper')}>
                                        <Image src={item.image} className={cx('recipe-img')} />
                                    </div>
                                    <div className={cx('recipe-info')}>
                                        <div className={cx('recipe-name')}>{item.name}</div>
                                        <div className={cx('recipe-price')}>{priceFormat(item.price)}đ</div>
                                    </div>
                                </div>
                                <div className={cx('recipe-actions')}></div>
                            </div>
                        ))
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
