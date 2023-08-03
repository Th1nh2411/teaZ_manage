import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import { HiShoppingBag } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import CartItem from './CartItem';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as invoiceService from '../../services/invoiceService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import Image from '../Image/Image';
import images from '../../assets/images';
import { RiFileWarningLine } from 'react-icons/ri';

const cx = classNames.bind(styles);

function Cart({ data = {}, onCloseModal = () => {}, onDelItem = () => {} }) {
    const localStorageManager = LocalStorageManager.getInstance();
    const navigate = useNavigate();
    const [state, dispatch] = useContext(StoreContext);

    const handleClickCheckout = async () => {
        navigate(config.routes.checkout, { state: { cart: data } });
        onCloseModal();
    };
    const handleCheckoutOldInvoice = () => {
        navigate(config.routes.payment, {
            state: { ...state.currentInvoice.invoice, cartInvoice: state.currentInvoice.cart },
        });
        onCloseModal();
    };
    return (
        <>
            <Modal
                className={cx('wrapper')}
                handleClickOutside={() => {
                    onCloseModal();
                }}
            >
                <div className={cx('header')}>
                    <div className={cx('left-side')}>
                        <HiShoppingBag className={cx('icon')} />
                        <div className={cx('title')}>
                            Giỏ hàng của bạn (
                            {data ? data.cart.reduce((total, current) => current.quantityProduct + total, 0) : 0} món)
                        </div>
                    </div>
                    <AiOutlineClose onClick={onCloseModal} className={cx('close-icon')} />
                </div>
                <div className={cx('body')}>
                    {data.cart && data.cart.length !== 0 ? (
                        data.cart.map((item, index) => <CartItem onDelItem={onDelItem} data={item} key={index} />)
                    ) : (
                        <div className={cx('empty-cart-wrapper')}>
                            <Image src={images.emptyCart} className={cx('empty-cart-img')} />
                            <div className={cx('empty-cart-title')}>Không có sản phẩm</div>
                        </div>
                    )}
                </div>
                <div className={cx('footer')}>
                    {state.currentInvoice ? (
                        <div className={cx('warning-wrapper')}>
                            <div className={cx('warning-title')}>
                                Bạn có hóa đơn chưa thanh toán
                                <RiFileWarningLine className={cx('warning-icon')} />
                            </div>
                            <div onClick={handleCheckoutOldInvoice} className={cx('warning-actions')}>
                                Thanh toán
                            </div>
                        </div>
                    ) : (
                        <div className={cx('total')}>
                            <div className={cx('total-title')}>Tổng tiền tạm tính:</div>
                            <div className={cx('total-num')}>{data.total && priceFormat(data.total)}đ</div>
                        </div>
                    )}
                    {data.cart && data.cart.length !== 0 ? (
                        <Button
                            onClick={handleClickCheckout}
                            disable={!!state.currentInvoice}
                            primary
                            className={cx('checkout-btn')}
                        >
                            {' '}
                            Thanh toán
                        </Button>
                    ) : (
                        <Button onClick={() => onCloseModal()} primary className={cx('checkout-btn')}>
                            {' '}
                            Quay lại
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default Cart;
