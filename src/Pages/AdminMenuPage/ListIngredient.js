import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import { RiAddCircleFill, RiCloseCircleFill } from 'react-icons/ri';
import HeadlessTippy from '@tippyjs/react/headless';
import { Popconfirm } from 'antd';

const cx = classNames.bind(styles);

function ListIngredient({ detailRecipe, onUpdateIngredient = () => {} }) {
    const [showAllIngredient, setShowAllIngredient] = useState();
    const [allIngredient, setAllIngredient] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const createIngredientRecipe = async (ingredientId, quantity) => {
        const results = await adminService.addIngredientFromRecipe({
            recipeId: detailRecipe.id,
            ingredientId,
            quantity,
        });
        if (results) {
            state.showToast(results.message);
        }
    };
    const updateIngredientQuantity = async (ingredientId, quantity) => {
        const results = await adminService.editIngredientFromRecipe({
            recipeId: detailRecipe.id,
            ingredientId,
            quantity,
        });
        if (results) {
            state.showToast(results.message);
        }
    };
    const removeIngredientQuantity = async (ingredientId) => {
        const results = await adminService.removeIngredientFromRecipe({
            recipeId: detailRecipe.id,
            ingredientId,
        });
        if (results) {
            state.showToast(results.message);
        }
    };
    const getIngredients = async () => {
        const results = await adminService.getAllIngredient();
        if (results) {
            setAllIngredient(
                results.data.filter(
                    (item) =>
                        detailRecipe.ingredients &&
                        !detailRecipe.ingredients.some((ingredientRecipe) => ingredientRecipe.id === item.id),
                ),
            );
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
                                    <Popconfirm
                                        key={index}
                                        title="Thêm nguyên liệu"
                                        description="Bạn chắc chắn muốn thêm nguyên liệu vào công thức?"
                                        onConfirm={async () => {
                                            await createIngredientRecipe(item.id, 20);
                                            setAllIngredient((prev) => prev.filter((item2) => item.id !== item2.id));
                                            onUpdateIngredient();
                                        }}
                                        okText="Thêm"
                                        cancelText="Huỷ"
                                    >
                                        <div className={cx('ingredient-item')}>{item.name}</div>
                                    </Popconfirm>
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
                                    <Popconfirm
                                        title="Xoá nguyên liệu"
                                        description="Bạn chắc chắn muốn xoá nguyên liệu ra khỏi công thức?"
                                        onConfirm={async () => {
                                            await removeIngredientQuantity(ingredient.id);
                                            onUpdateIngredient();
                                        }}
                                        okText="Xoá"
                                        cancelText="Huỷ"
                                    >
                                        <RiCloseCircleFill className={cx('del-icon')} />
                                    </Popconfirm>
                                </div>

                                <div className={cx('ingredient-name')}>
                                    <select
                                        className={cx('ingredient-select')}
                                        // value={ingredient.quantity}
                                        defaultValue={ingredient.quantity}
                                        onChange={(event) => {
                                            updateIngredientQuantity(ingredient.id, event.target.value);
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
                                <h5 className={cx('remain-quantity')}>
                                    (còn lại: {ingredient.remainQuantity}
                                    {ingredient.unitName})
                                </h5>
                            </div>
                        </Col>
                    ))}
            </Row>
        </>
    );
}

export default ListIngredient;
