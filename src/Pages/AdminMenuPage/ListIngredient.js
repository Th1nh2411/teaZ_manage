import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import { RiAddCircleFill, RiCloseCircleFill } from 'react-icons/ri';
import HeadlessTippy from '@tippyjs/react/headless';

const cx = classNames.bind(styles);

function ListIngredient({ detailRecipe, onUpdateIngredient = () => {} }) {
    const [showAllIngredient, setShowAllIngredient] = useState();
    const [allIngredient, setAllIngredient] = useState();
    const localStorageManage = LocalStorageManager.getInstance();
    const updateIngredientQuantity = async (idIngredient, quantity) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.editIngredientFromRecipe(
                detailRecipe.idRecipe,
                idIngredient,
                quantity,
                token,
            );
            if (results && results.detailRecipe) {
            }
        }
    };
    const getIngredients = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.getAllIngredient(token);
            if (results && results.listIngredient) {
                setAllIngredient(
                    results.listIngredient.filter(
                        (item) =>
                            !detailRecipe.ingredients.some(
                                (ingredientRecipe) => ingredientRecipe.idIngredient === item.idIngredient,
                            ),
                    ),
                );
            }
        }
    };
    return (
        <>
            <div className={cx('item-title')}>
                Nguyên liệu
                <HeadlessTippy
                    interactive
                    visible={showAllIngredient}
                    onClickOutside={() => setShowAllIngredient(false)}
                    placement="right"
                    offset={[0, 10]}
                    render={(attrs) => (
                        <div className={cx('all-ingredients')}>
                            {allIngredient &&
                                allIngredient.map((item, index) => (
                                    <div
                                        onClick={async () => {
                                            await updateIngredientQuantity(item.idIngredient, 1);
                                            setShowAllIngredient(false);
                                            onUpdateIngredient();
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
                            setShowAllIngredient(!showAllIngredient);
                            getIngredients();
                        }}
                        className={cx('icon')}
                    >
                        <RiAddCircleFill />
                    </div>
                </HeadlessTippy>
            </div>
            <Row>
                {detailRecipe.ingredients &&
                    detailRecipe.ingredients.map((ingredient, index) => (
                        <Col md={4} key={index}>
                            <div className={cx('ingredient-wrapper')}>
                                <div className={cx('ingredient-img-wrapper')}>
                                    <Image className={cx('ingredient-img')} src={ingredient.image} />
                                    <RiCloseCircleFill
                                        onClick={async () => {
                                            if (window.confirm('Remove the item?')) {
                                                await updateIngredientQuantity(ingredient.idIngredient, 0);
                                                onUpdateIngredient();
                                            }
                                        }}
                                        className={cx('del-icon')}
                                    />
                                </div>

                                <div className={cx('ingredient-name')}>
                                    <select
                                        className={cx('ingredient-select')}
                                        // value={ingredient.quantity}
                                        defaultValue={ingredient.quantity}
                                        onChange={(event) => {
                                            updateIngredientQuantity(ingredient.idIngredient, event.target.value);
                                        }}
                                    >
                                        {[...Array(999).keys()].map((value) => (
                                            <option key={value + 1} value={value + 1}>
                                                {value + 1 + ingredient.unitName}
                                            </option>
                                        ))}
                                    </select>
                                    {ingredient.name}
                                </div>
                            </div>
                        </Col>
                    ))}
            </Row>
        </>
    );
}

export default ListIngredient;
