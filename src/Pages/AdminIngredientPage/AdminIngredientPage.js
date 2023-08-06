import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import { StoreContext, actions } from '../../store';
import Tippy from '@tippyjs/react';
import { GiMilkCarton } from 'react-icons/gi';
import { BiImport, BiExport, BiEdit } from 'react-icons/bi';
import LocalStorageManager from '../../utils/LocalStorageManager';
import Input from '../../components/Input/Input';
import { onlyNumber } from '../../utils/format';
import IngredientForm from './IngredientForm';
import { RiAddCircleFill } from 'react-icons/ri';
import { FaSort } from 'react-icons/fa';
import ImportForm from './ImportForm';
import ExportForm from './ExportForm';
import ExportFile from '../../components/ExportFile';
import QuantityChange from './QuantityChange';
const cx = classNames.bind(styles);

function AdminIngredientPage() {
    const [defaultIngredients, setDefaultIngredients] = useState();
    const [ingredients, setIngredients] = useState();
    const [loading, setLoading] = useState();
    const [sort, setSort] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState();
    const [showIngredientForm, setShowIngredientForm] = useState();
    const [showImportForm, setShowImportForm] = useState();
    const [showExportForm, setShowExportForm] = useState();
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const getIngredients = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            setLoading(true);
            const results = await adminService.getAllIngredient(token);
            if (results && results.listIngredient) {
                setDefaultIngredients(results.listIngredient);
                setIngredients(results.listIngredient);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        getIngredients();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {showImportForm && (
                <ImportForm
                    selectedIngredient={selectedIngredient}
                    onCloseModal={(update) => {
                        if (update) {
                            getIngredients();
                        }
                        setShowImportForm(false);
                    }}
                />
            )}
            {showExportForm && (
                <ExportForm
                    selectedIngredient={selectedIngredient}
                    onCloseModal={(update) => {
                        if (update) {
                            getIngredients();
                        }
                        setShowExportForm(false);
                    }}
                />
            )}
            {showIngredientForm && (
                <IngredientForm
                    data={selectedIngredient}
                    onCloseModal={(update) => {
                        if (update) {
                            getIngredients();
                        }
                        setShowIngredientForm(false);
                        setSelectedIngredient(false);
                    }}
                />
            )}

            {loading ? (
                <div className={cx('loader')}>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <>
                    <Row>
                        <Col>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        <GiMilkCarton className={cx('icon', 'warning')} />
                                        Danh sách nguyên liệu
                                        <FaSort
                                            onClick={() => {
                                                if (sort === 0) {
                                                    setSort(1);
                                                    setIngredients(ingredients.sort((a, b) => a.quantity - b.quantity));
                                                } else {
                                                    setSort(0);
                                                    setIngredients(ingredients.sort((a, b) => b.quantity - a.quantity));
                                                }
                                            }}
                                            className={cx('sort-btn')}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            title={'Tìm nguyên liệu'}
                                            value={searchValue}
                                            onChange={(e) => {
                                                setSearchValue(e.target.value);
                                                setIngredients(
                                                    defaultIngredients.filter((item) =>
                                                        item.name.toUpperCase().includes(e.target.value.toUpperCase()),
                                                    ),
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className={cx('content-subtitle')}>
                                        <ExportFile
                                            csvData={
                                                ingredients &&
                                                ingredients.map((item) => {
                                                    return {
                                                        id: item.idIngredient,
                                                        Tên: item.name,
                                                        'Trạng thái': item.isActive
                                                            ? 'Đang sử dụng'
                                                            : item.quantity === 0
                                                            ? 'Hết hàng'
                                                            : 'Không sử dụng',
                                                        'Số lượng': item.quantity,
                                                        ĐVT: item.unitName,
                                                    };
                                                })
                                            }
                                            fileName="ListIngredient"
                                        />
                                        <div onClick={() => setShowIngredientForm(true)} className={cx('icon')}>
                                            <RiAddCircleFill />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('content-body')}>
                                    {ingredients && ingredients.length !== 0 ? (
                                        ingredients.map((ingredient, index) => (
                                            <div
                                                key={index}
                                                className={cx('ingredient-item', {
                                                    inactive: ingredient.quantity === 0,
                                                })}
                                            >
                                                <div className={cx('ingredient-content')}>
                                                    <div className={cx('ingredient-img-wrapper')}>
                                                        <Image
                                                            src={ingredient.image}
                                                            className={cx('ingredient-img')}
                                                        />
                                                    </div>
                                                    <div className={cx('ingredient-info')}>
                                                        <div className={cx('ingredient-name')}>{ingredient.name}</div>
                                                        <div className={cx('ingredient-info')}>
                                                            <span>Còn lại:</span>
                                                            {ingredient.quantity}
                                                            {ingredient.unitName}
                                                        </div>
                                                        <div className={cx('ingredient-info')}>
                                                            <span>Trạng thái :</span>
                                                            <span
                                                                className={cx({
                                                                    inactive:
                                                                        !ingredient.isActive ||
                                                                        ingredient.quantity === 0,
                                                                    active: ingredient.isActive,
                                                                })}
                                                            >
                                                                {ingredient.quantity === 0
                                                                    ? 'Hết nguyên liệu'
                                                                    : ingredient.isActive
                                                                    ? 'Đang sử dụng'
                                                                    : 'Không'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cx('ingredient-actions')}>
                                                    <Button
                                                        disable={userRole < 2}
                                                        onClick={() => {
                                                            setShowImportForm(true);
                                                            setSelectedIngredient(ingredient);
                                                        }}
                                                        primary
                                                        rightIcon={<BiImport />}
                                                        className={cx('action')}
                                                    >
                                                        Nhập hàng
                                                    </Button>
                                                    <Button
                                                        disable={userRole < 2}
                                                        onClick={() => {
                                                            setShowExportForm(true);
                                                            setSelectedIngredient(ingredient);
                                                        }}
                                                        rightIcon={<BiExport />}
                                                        className={cx('action')}
                                                    >
                                                        Xuất hàng
                                                    </Button>
                                                    <Tippy content="Chỉnh sửa" placement="bottom" duration={0}>
                                                        <div className={cx('edit-btn')}>
                                                            <BiEdit
                                                                onClick={() => {
                                                                    setShowIngredientForm(true);
                                                                    setSelectedIngredient(ingredient);
                                                                }}
                                                            />
                                                        </div>
                                                    </Tippy>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={cx('empty-order-wrapper')}>
                                            <Image src={images.emptyCart} className={cx('empty-order-img')} />
                                            <div className={cx('empty-order-title')}>
                                                Không tìm thấy nguyên liệu nào
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <QuantityChange />
                </>
            )}
        </div>
    );
}

export default AdminIngredientPage;
