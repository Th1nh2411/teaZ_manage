import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import * as menuService from '../../services/menuService';
import { StoreContext, actions } from '../../store';
import LocalStorageManager from '../../utils/LocalStorageManager';
import HeadlessTippy from '@tippyjs/react/headless';
import RecipeItem from './RecipeItem';
import { RiAddCircleFill, RiCloseCircleFill } from 'react-icons/ri';
import { GiCoffeeBeans } from 'react-icons/gi';
import { TbLemon, TbPaperBag } from 'react-icons/tb';
import { SiBuymeacoffee, SiCakephp } from 'react-icons/si';
import RecipeForm from './RecipeForm';
import { priceFormat } from '../../utils/format';
import Tippy from '@tippyjs/react';
import ExportFile from '../../components/ExportFile/ExportFile';
import Input from '../../components/Input/Input';
const cx = classNames.bind(styles);

function AdminMenuPage() {
    const [loading, setLoading] = useState();
    const [menuType1, setMenuType1] = useState([]);
    const [menuType2, setMenuType2] = useState([]);
    const [menuType3, setMenuType3] = useState([]);
    const [menuType4, setMenuType4] = useState([]);
    const [allTopping, setAllTopping] = useState();
    const [showEditForm, setShowEditForm] = useState();
    const [selectedRecipe, setSelectedRecipe] = useState();
    const localStorageManage = LocalStorageManager.getInstance();
    const [listToppingByType, setListToppingByType] = useState();
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
            const results = await menuService.getMenuByType(5, token);
            if (results && results.isSuccess) {
                setAllTopping(results.menu);
            }
        }
    };
    useEffect(() => {
        getAllTopping();
    }, []);
    const getListToppingByType = async () => {
        const results = await adminService.getListToppingByType();
        if (results && results.isSuccess) {
            setListToppingByType(results.listType);
        }
    };
    useEffect(() => {
        getListToppingByType();
    }, []);
    return (
        <div className={cx('wrapper')}>
            {showEditForm && (
                <RecipeForm
                    idRecipe={selectedRecipe.idRecipe}
                    onCloseModal={(updated) => {
                        if (updated) {
                            getMenuDataByType(1);
                            getMenuDataByType(2);
                            getMenuDataByType(3);
                            getMenuDataByType(4);
                            // getListToppingByType();
                            getAllTopping();
                        }
                        setShowEditForm(false);
                        setSelectedRecipe(false);
                    }}
                />
            )}
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
                            onUpdateTopping={async () => await getListToppingByType()}
                            idType={1}
                            titleIcon={<SiBuymeacoffee className={cx('icon')} />}
                            topping={
                                listToppingByType && listToppingByType.find((type) => type.idType === 1).listToppings
                            }
                            menuData={menuType1}
                            title="Trà sữa"
                            onShowEditForm={(data) => {
                                setShowEditForm(true);
                                setSelectedRecipe(data);
                            }}
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            onUpdateTopping={async () => await getListToppingByType()}
                            idType={2}
                            titleIcon={<GiCoffeeBeans className={cx('icon')} />}
                            topping={
                                listToppingByType && listToppingByType.find((type) => type.idType === 2).listToppings
                            }
                            menuData={menuType2}
                            title="Cà phê"
                            onShowEditForm={(data) => {
                                setShowEditForm(true);
                                setSelectedRecipe(data);
                            }}
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            onUpdateTopping={async () => await getListToppingByType()}
                            idType={3}
                            titleIcon={<TbPaperBag className={cx('icon')} />}
                            topping={
                                listToppingByType && listToppingByType.find((type) => type.idType === 3).listToppings
                            }
                            menuData={menuType3}
                            title="Trà trái cây"
                            onShowEditForm={(data) => {
                                setShowEditForm(true);
                                setSelectedRecipe(data);
                            }}
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            onUpdateTopping={async () => await getListToppingByType()}
                            idType={4}
                            titleIcon={<SiCakephp className={cx('icon')} />}
                            topping={
                                listToppingByType && listToppingByType.find((type) => type.idType === 4).listToppings
                            }
                            menuData={menuType4}
                            title="Bakery"
                            onShowEditForm={(data) => {
                                setShowEditForm(true);
                                setSelectedRecipe(data);
                            }}
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            idType={5}
                            titleIcon={<TbLemon className={cx('icon')} />}
                            menuData={allTopping}
                            title="Topping"
                            onShowEditForm={(data) => {
                                setShowEditForm(true);
                                setSelectedRecipe(data);
                            }}
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
}
function ContentWrapper({
    title,
    titleIcon,
    menuData,
    topping,
    allTopping,
    onShowEditForm,
    idType,
    onUpdateTopping = () => {},
}) {
    const [tab, setTab] = useState(0);
    const [menu, setMenu] = useState(menuData || []);
    const [searchValue, setSearchValue] = useState('');
    const localStorageManage = LocalStorageManager.getInstance();
    const [showAllTopping, setShowAllTopping] = useState(false);
    useEffect(() => {
        setMenu(menuData);
    }, [menuData]);
    const listAddToppingFiltered =
        allTopping &&
        topping &&
        allTopping.filter((item) => !topping.some((item2) => item2.idRecipe === item.idRecipe));
    const addToppingToType = async (idRecipe) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.addToppingToType(idRecipe, idType, token);
            if (results && results.isSuccess) {
            }
        }
    };
    const deleteToppingFromType = async (idRecipe) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.delToppingFromType(idRecipe, idType, token);
            if (results && results.isSuccess) {
            }
        }
    };
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
                    <ExportFile
                        csvData={
                            menu &&
                            menu.map((item) => {
                                return {
                                    id: item.idRecipe,
                                    Tên: item.name,
                                    'Mô tả': item.info,
                                    Giá: item.price,
                                    'Giảm giá': item.discount + '%',
                                    loại:
                                        item.idType === 1
                                            ? 'Trà sữa'
                                            : item.idType === 2
                                            ? 'Coffee'
                                            : item.idType === 3
                                            ? 'Trà trái cây'
                                            : 'Bakery',
                                    'Trạng thái': item.isActive ? 'Đang sử dụng' : 'Không sử dụng',
                                };
                            })
                        }
                        fileName="ListMenu"
                    />
                    <HeadlessTippy
                        interactive
                        visible={showAllTopping}
                        onClickOutside={() => setShowAllTopping(false)}
                        placement="right"
                        offset={[0, 10]}
                        render={(attrs) => (
                            <div className={cx('all-ingredients')}>
                                {listAddToppingFiltered &&
                                    listAddToppingFiltered.map((item, index) => (
                                        <div
                                            onClick={async () => {
                                                await addToppingToType(item.idRecipe);
                                                setShowAllTopping(false);
                                                onUpdateTopping();
                                            }}
                                            key={index}
                                            className={cx('ingredient-item')}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    >
                        <div
                            onClick={() => {
                                if (tab === 0) {
                                    onShowEditForm(true);
                                } else {
                                    setShowAllTopping(!showAllTopping);
                                }
                            }}
                            className={cx('icon')}
                        >
                            <RiAddCircleFill />
                        </div>
                    </HeadlessTippy>
                </div>
            </div>
            <div className={cx('content-body')}>
                <div className={cx('content-pane', { active: tab === 0 })}>
                    {menu && menu.length !== 0 ? (
                        menu.map((item, index) => (
                            <RecipeItem
                                data={item}
                                key={index}
                                onClickEditRecipe={() => {
                                    onShowEditForm(item);
                                }}
                            />
                        ))
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
                                <div className={cx('recipe-actions')}>
                                    <Tippy content="Xóa khỏi danh sách" placement="bottom" duration={0}>
                                        <div
                                            onClick={async () => {
                                                if (window.confirm('Remove the item?')) {
                                                    await deleteToppingFromType(item.idRecipe);
                                                    onUpdateTopping();
                                                }
                                            }}
                                            className={cx('recipe-edit')}
                                        >
                                            <RiCloseCircleFill />
                                        </div>
                                    </Tippy>
                                </div>
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

export default AdminMenuPage;
