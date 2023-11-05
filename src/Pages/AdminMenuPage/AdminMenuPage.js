import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import * as menuService from '../../services/menuService';
import { StoreContext, actions } from '../../store';
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
import { Popconfirm } from 'antd';
import { MdDeleteForever, MdDeleteOutline } from 'react-icons/md';
const cx = classNames.bind(styles);

function AdminMenuPage() {
    const [loading, setLoading] = useState();
    const [menuType1, setMenuType1] = useState([]);
    const [menuType2, setMenuType2] = useState([]);
    const [menuType3, setMenuType3] = useState([]);
    const [menuType4, setMenuType4] = useState([]);
    const [topping1, setTopping1] = useState();
    const [topping2, setTopping2] = useState();
    const [topping3, setTopping3] = useState();
    const [topping4, setTopping4] = useState();
    const [allTopping, setAllTopping] = useState();
    const [editType, setShowEditForm] = useState();
    const [selectedRecipe, setSelectedRecipe] = useState();
    const getMenuDataByType = async (idType) => {
        setLoading(true);
        const results = await menuService.getMenuByType(idType);
        if (results) {
            idType === 1
                ? setMenuType1(results.data)
                : idType === 2
                ? setMenuType2(results.data)
                : idType === 3
                ? setMenuType3(results.data)
                : idType === 4
                ? setMenuType4(results.data)
                : setAllTopping(results.data);
        }
        setLoading(false);
    };
    const getListToppingByType = async (idType) => {
        const results = await adminService.getListToppingByType(idType);
        if (results) {
            idType === 1
                ? setTopping1(results.data)
                : idType === 2
                ? setTopping2(results.data)
                : idType === 3
                ? setTopping3(results.data)
                : setTopping4(results.data);
        }
    };
    useEffect(() => {
        getMenuDataByType(1);
        getMenuDataByType(2);
        getMenuDataByType(3);
        getMenuDataByType(4);
        getMenuDataByType(5);
        getListToppingByType(1);
        getListToppingByType(2);
        getListToppingByType(3);
        getListToppingByType(4);
    }, []);

    return (
        <div className={cx('wrapper')}>
            {editType && (
                <RecipeForm
                    id={selectedRecipe.id}
                    type={editType}
                    onCloseModal={(idUpdated) => {
                        if (idUpdated) {
                            getMenuDataByType(idUpdated);
                            // getListToppingByType();
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
                            onUpdateTopping={async () => await getListToppingByType(1)}
                            idType={1}
                            titleIcon={<SiBuymeacoffee className={cx('icon')} />}
                            topping={topping1}
                            menuData={menuType1}
                            title="Trà sữa"
                            onShowEditForm={(data) => {
                                setShowEditForm(1);
                                setSelectedRecipe(data);
                            }}
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            onUpdateTopping={async () => await getListToppingByType(2)}
                            idType={2}
                            titleIcon={<GiCoffeeBeans className={cx('icon')} />}
                            topping={topping2}
                            menuData={menuType2}
                            title="Cà phê"
                            onShowEditForm={(data) => {
                                setShowEditForm(2);
                                setSelectedRecipe(data);
                            }}
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            onUpdateTopping={async () => await getListToppingByType(3)}
                            idType={3}
                            titleIcon={<TbPaperBag className={cx('icon')} />}
                            topping={topping3}
                            menuData={menuType3}
                            title="Trà trái cây"
                            onShowEditForm={(data) => {
                                setShowEditForm(3);
                                setSelectedRecipe(data);
                            }}
                        />
                    </Col>
                    <Col xxl={6}>
                        <ContentWrapper
                            allTopping={allTopping || []}
                            onUpdateTopping={async () => await getListToppingByType(4)}
                            idType={4}
                            titleIcon={<SiCakephp className={cx('icon')} />}
                            topping={topping4}
                            menuData={menuType4}
                            title="Bakery"
                            onShowEditForm={(data) => {
                                setShowEditForm(4);
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
                                setShowEditForm(5);
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
    const [showAllTopping, setShowAllTopping] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    useEffect(() => {
        setMenu(menuData);
    }, [menuData]);
    const listAddToppingFiltered =
        allTopping && topping && allTopping.filter((item) => !topping.some((item2) => item2.id === item.id));
    const addToppingToType = async (id) => {
        const results = await adminService.addToppingToType(id, idType);
        if (results) {
            state.showToast(results.message);
            onUpdateTopping();
            setShowAllTopping();
        }
    };
    const deleteToppingFromType = async (id) => {
        const results = await adminService.delToppingFromType(id, idType);
        if (results) {
            state.showToast(results.message);
            onUpdateTopping();
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
                                    id: item.id,
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
                                        <Popconfirm
                                            title={'Thêm topping'}
                                            description={'Thêm topping này vào danh sách?'}
                                            onConfirm={() => addToppingToType(item.id)}
                                            okText={'Xác nhận'}
                                            cancelText="Huỷ"
                                            key={index}
                                            zIndex={10000}
                                        >
                                            <div className={cx('ingredient-item')}>{item.name}</div>
                                        </Popconfirm>
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
                                    <Popconfirm
                                        title={'Xoá topping'}
                                        description={'Xoá topping này ra khỏi danh sách?'}
                                        onConfirm={() => deleteToppingFromType(item.id)}
                                        okText={'Xác nhận'}
                                        cancelText="Huỷ"
                                    >
                                        <div className={cx('recipe-del')}>
                                            <MdDeleteForever />
                                        </div>
                                    </Popconfirm>
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
