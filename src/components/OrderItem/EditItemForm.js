import styles from './OrderItem.module.scss';
import classNames from 'classnames/bind';
import Image from '../Image';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as menuService from '../../services/menuService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';

const cx = classNames.bind(styles);

function EditItemForm({ idRecipe = 1, onCloseModal = () => {} }) {
    const [detailRecipe, setDetailRecipe] = useState({});
    const [nameValue, setNameValue] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [discountValue, setDiscountValue] = useState('');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const editMenuItem = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await menuService.editMenuItem(idRecipe, detailRecipe.isActive, 100 - discountValue, token);
        }
    };
    const getDetailRecipe = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await menuService.getDetailRecipe(idRecipe, token);
            setDetailRecipe(results.recipe);
            setNameValue(results.recipe.name);
            setPriceValue(results.recipe.price);
            setDiscountValue(100 - results.recipe.discount);
        }
    };
    const handleCancelEdit = () => {
        setNameValue(detailRecipe.name);
        setPriceValue(detailRecipe.price);
        setDiscountValue(100 - detailRecipe.discount);
    };
    const handleClickConfirm = async () => {
        await editMenuItem();
        dispatch(actions.setToast({ show: true, title: 'Sửa món', content: 'Sửa món thành cống' }));
        onCloseModal(true);
    };
    useEffect(() => {
        getDetailRecipe();
    }, []);
    useEffect(() => {
        if (
            detailRecipe.name !== nameValue ||
            detailRecipe.price !== Number(priceValue) ||
            100 - detailRecipe.discount !== Number(discountValue)
        ) {
            setValueChange(true);
        } else {
            setValueChange(false);
        }
    }, [nameValue, priceValue, discountValue]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('edit-form-wrapper')}
        >
            <div className={cx('form-header')}></div>
            <div className={cx('form-body')}>
                <div className={cx('form-img-wrapper')}>
                    <Image src={detailRecipe.image} className={cx('form-img')} />
                </div>
                <div className={cx('form-info')}>
                    <Input
                        disable={userRole !== 3}
                        onChange={(event) => {
                            setNameValue(event.target.value);
                            setValueChange(true);
                        }}
                        value={nameValue}
                        title="Tên món"
                        type="text"
                    />
                    <div className={cx('item-price-wrapper')}>
                        <Input
                            disable={userRole !== 3}
                            className={cx('price-input')}
                            onChange={(event) => {
                                if (onlyNumber(event.target.value)) {
                                    setPriceValue(event.target.value);
                                    setValueChange(true);
                                }
                            }}
                            value={priceValue}
                            unit=".000 vnđ"
                            title="Giá món"
                            type="text"
                        />
                        <Input
                            disable={userRole < 2}
                            className={cx('price-input')}
                            onChange={(event) => {
                                if (onlyNumber(event.target.value)) {
                                    setDiscountValue(event.target.value);
                                    setValueChange(true);
                                }
                            }}
                            value={discountValue.toString()}
                            unit="%"
                            title="Discount"
                            type="text"
                        />
                    </div>
                    <div className={cx('item-title')}>Nguyên liệu </div>
                    <Row className={cx('item-ingredients')}>
                        {detailRecipe.ingredients &&
                            detailRecipe.ingredients.map((ingredient, index) => (
                                <Col key={index}>
                                    <div className={cx('ingredient-wrapper')}>
                                        <Image className={cx('ingredient-img')} src={ingredient.image} />

                                        <div className={cx('ingredient-name')}>
                                            <span className={cx('ingredient-quantity')}>
                                                {ingredient.quantity}
                                                {ingredient.unitName}
                                            </span>
                                            {ingredient.name}
                                        </div>

                                        <div className={cx('ingredient-remain')}>
                                            ({ingredient.remainingQuantity}
                                            {ingredient.unitName} left)
                                        </div>
                                    </div>
                                </Col>
                            ))}
                    </Row>
                    <div className={cx('form-actions')}>
                        {valueChange && <Button onClick={handleCancelEdit}>Hủy</Button>}
                        <Button
                            onClick={handleClickConfirm}
                            className={cx('confirm-btn')}
                            primary
                            disable={!valueChange}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default EditItemForm;
