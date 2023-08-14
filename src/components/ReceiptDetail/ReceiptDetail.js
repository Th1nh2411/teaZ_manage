import styles from './ReceiptDetail.module.scss';
import classNames from 'classnames/bind';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function ReceiptDetail({ data, onCloseModal = () => {} }) {
    useEffect(() => {
        window.print();
    }, []);
    return (
        <>
            {data && (
                <Modal
                    handleClickOutside={() => {
                        onCloseModal();
                    }}
                    className={cx('wrapper')}
                >
                    <div className={cx('header')}>
                        <h2>TeaZ - Drinks & Bakery</h2>
                        <div className={cx('info')}>
                            Địa chỉ : <span>7 Lê Văn Việt, Thành Phố Thủ Đức</span>
                        </div>
                        <div className={cx('info')}>
                            Số điện thoại : <span>0935098022</span>
                        </div>

                        <div className={cx('info')}>
                            Ngày đặt :{' '}
                            <span>
                                {dayjs(data.date).format('HH:mm')} {dayjs(data.date).format('DD/MM/YYYY')}
                            </span>
                        </div>
                    </div>
                    <h2 className={cx('title')}>HOÁ ĐƠN BÁN HÀNG</h2>
                    <h4>HD{data.idInvoice}</h4>
                    <div className={cx('body')}>
                        <div className={cx('body-title')}>Các món đã đặt</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Đơn giá</th>
                                    <th className={cx('text-center')}>SL</th>
                                    <th className={cx('text-center')}>Đơn giá</th>
                                    <th className={cx('text-end')}>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data &&
                                    data.products.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className={cx('product-info')}>
                                                    <div className={cx('product-name')}>
                                                        {item.name}({item.size ? 'L' : 'M'})
                                                    </div>
                                                    {item.listTopping.length !== 0 && (
                                                        <div className={cx('product-topping')}>
                                                            {item.listTopping.map((topping) => topping.name).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className={cx('text-center')}>{item.quantity}</td>
                                            <td className={cx('text-center')}>
                                                {priceFormat(item.totalProduct / item.quantity)}đ
                                            </td>
                                            <td className={cx('text-end', 'product-price')}>
                                                {priceFormat(item.totalProduct)}đ
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={cx('footer')}>
                        <div className={cx('price-info')}>
                            Tổng tiền các món : <span>{priceFormat(data.total)}đ</span>
                        </div>
                        <div className={cx('price-info')}>
                            Phí ship : <span>{priceFormat(data.shippingFee)}đ</span>
                        </div>
                        <div className={cx('price-info')}>
                            Thành tiền : <span>{priceFormat(data.total + data.shippingFee)}đ</span>
                        </div>
                        <div className={cx('price-info')}>
                            Thanh toán :{' '}
                            <span>{data.payment_status ? priceFormat(data.total + data.shippingFee) + 'đ' : '0đ'}</span>
                        </div>
                        <div className={cx('price-info')}>
                            Thu :{' '}
                            <span>{data.payment_status ? '0đ' : priceFormat(data.total + data.shippingFee) + 'đ'}</span>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default ReceiptDetail;
