import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Calendar from '../../components/Calendar';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as orderService from '../../services/orderService';
import { StoreContext, actions } from '../../store';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { priceFormat, timeGap } from '../../utils/format';
import { BsClipboardCheckFill } from 'react-icons/bs';
import { HiDocumentMinus } from 'react-icons/hi2';
import { RiEBike2Fill } from 'react-icons/ri';
import { FaFileInvoiceDollar } from 'react-icons/fa';

import Tippy from '@tippyjs/react';
import dayjs from 'dayjs';
const cx = classNames.bind(styles);

function InvoiceList() {
    const [invoices, setInvoices] = useState();
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const localStorageManager = LocalStorageManager.getInstance();

    const getAllInvoiceByDate = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await orderService.getAllInvoiceByDate(date, token);
            if (results) {
                setInvoices(results.invoices);
            }
        }
    };

    useEffect(() => {
        getAllInvoiceByDate();
    }, [date]);
    return (
        <div className={cx('content-wrapper')}>
            <div className={cx('content-header')}>
                <div className={cx('content-title')}>
                    <FaFileInvoiceDollar className={cx('icon', 'highlight')} />
                    Danh sách hóa đơn
                </div>
                <div>
                    <Calendar onDayChange={(date) => setDate(date.format('YYYY-MM-DD'))} />
                </div>
                <div className={cx('content-subtitle')}>{invoices && invoices.length} đơn</div>
            </div>
            <div className={cx('content-body')}>
                {invoices && invoices.length !== 0 ? (
                    invoices.map((invoice, index) => (
                        <div key={index} className={cx('order-list')}>
                            <div className={cx('order-header')}>
                                <div className={cx('order-title')}>
                                    Đơn {invoice.idInvoices} - {timeGap(invoice.date)}
                                </div>

                                <div className={cx('order-subtitle')}>Total: {priceFormat(invoice.total)}đ</div>
                            </div>
                            {invoice.detail.map((item, index) => (
                                <div key={index} className={cx('order-item-wrapper')}>
                                    <Image src={item.image} className={cx('order-item-img')} />
                                    <div className={cx('order-item-info')}>
                                        <div className={cx('order-item-name')}>
                                            {item.name}({item.size ? 'L' : 'M'}) x{item.quantityProduct}
                                        </div>
                                        <div className={cx('order-item-topping')}>
                                            Topping :{' '}
                                            {item.listTopping.map((topping) => topping.name).join(', ') || 'Không'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className={cx('empty-order-wrapper')}>
                        <Image src={images.emptyCart} className={cx('empty-order-img')} />
                        <div className={cx('empty-order-title')}>Không có đơn hàng nào</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InvoiceList;
