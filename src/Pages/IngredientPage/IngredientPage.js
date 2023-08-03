import styles from './IngredientPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as ingredientService from '../../services/ingredientService';
import { StoreContext, actions } from '../../store';
import Tippy from '@tippyjs/react';
import { GiMilkCarton } from 'react-icons/gi';
import { BiImport, BiExport } from 'react-icons/bi';
import LocalStorageManager from '../../utils/LocalStorageManager';
import Input from '../../components/Input/Input';
import { onlyNumber } from '../../utils/format';
import ImportForm from './ImportForm';
import ExportForm from './ExportForm';
const cx = classNames.bind(styles);

function IngredientPage() {
    const [ingredients, setIngredients] = useState();
    const [loading, setLoading] = useState();
    const [selectedIngredient, setSelectedIngredient] = useState();
    const [showImportForm, setShowImportForm] = useState();
    const [showExportForm, setShowExportForm] = useState();
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const getIngredients = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            setLoading(true);
            const results = await ingredientService.getListIngredient(token);
            if (results && results.ingredients) {
                setIngredients(results.ingredients);
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
            {loading ? (
                <div className={cx('loader')}>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <Row>
                    <Col>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <GiMilkCarton className={cx('icon', 'warning')} />
                                    Danh sách nguyên liệu
                                </div>
                                <div className={cx('content-subtitle')}>
                                    {ingredients && ingredients.length} nguyên liệu
                                </div>
                            </div>
                            <div className={cx('content-body')}>
                                {ingredients &&
                                    ingredients.map((ingredient, index) => (
                                        <div
                                            key={index}
                                            className={cx('ingredient-item', { inactive: ingredient.quantity === 0 })}
                                        >
                                            <div className={cx('ingredient-content')}>
                                                <div className={cx('ingredient-img-wrapper')}>
                                                    <Image src={ingredient.image} className={cx('ingredient-img')} />
                                                </div>
                                                <div className={cx('ingredient-info')}>
                                                    <div className={cx('ingredient-name')}>{ingredient.name}</div>
                                                    <div className={cx('ingredient-remain')}>
                                                        <span>Còn lại:</span>
                                                        {ingredient.quantity}
                                                        {ingredient.unitName}
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
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default IngredientPage;
