import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
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
import { Select } from 'antd';

import Tippy from '@tippyjs/react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const cx = classNames.bind(styles);

const { Option } = Select;

function InvoiceList() {
    const [invoices, setInvoices] = useState();
    const [fromdate, setFromdate] = useState(dayjs().format('YYYY-MM-DD'));
    const [todate, setTodate] = useState(dayjs().format('YYYY-MM-DD'));
    const [status, setStatus] = useState('');

    const getAllInvoiceByDate = async () => {
        const results = await orderService.getAllInvoiceByDateAndStatus(fromdate, todate, status);
        console.log(results);
        if (results) {
            setInvoices(results.data);
        }
    };

    useEffect(() => {
        getAllInvoiceByDate();
    }, [fromdate, todate, status]);
    return (
        <div className={cx('content-wrapper')}>
            <div className={cx('content-header')}>
                <div className={cx('content-title')}>
                    <FaFileInvoiceDollar className={cx('icon', 'highlight')} />
                    Danh sách hóa đơn
                </div>
                <div>
                    <DatePicker
                        size="large"
                        value={dayjs(fromdate)}
                        onChange={(fromdate) => {
                            if (fromdate) setFromdate(fromdate.format('YYYY-MM-DD'));
                        }}
                    />
                </div>
                <div>
                    <DatePicker
                        size="large"
                        value={dayjs(todate)}
                        onChange={(todate) => {
                            if (todate) setTodate(todate.format('YYYY-MM-DD'));
                        }}
                    />
                </div>
                <div>
                    Trạng thái hoá đơn
                    <Select
                        size="large"
                        value={status}
                        onChange={(value) => {
                            setStatus(value);
                        }}
                    >
                        <Option value="0">Chưa xác nhận</Option>
                        <Option value="1">Đã xác nhận</Option>
                        <Option value="2">Đang giao</Option>
                        <Option value="3">Hoàn thành</Option>
                        <Option value="4">Đã huỷ</Option>
                    </Select>
                </div>
                <div className={cx('content-subtitle')}>{invoices && invoices.length} đơn</div>
            </div>
            <div className={cx('content-body')}>
                {invoices && invoices.length !== 0 ? (
                    invoices.map((invoice, index) => (
                        <div key={index} className={cx('order-list')}>
                            <div className={cx('order-header')}>
                                <div className={cx('order-title')}>
                                    Đơn {invoice.id} - {timeGap(invoice.date)}
                                </div>

                                <div className={cx('order-subtitle')}>Total: {priceFormat(invoice.total)}đ</div>
                            </div>
                            {invoice.products.map((item, index) => (
                                <div key={index} className={cx('order-item-wrapper')}>
                                    <Image src={item.image} className={cx('order-item-img')} />
                                    <div className={cx('order-item-info')}>
                                        <div className={cx('order-item-name')}>
                                            {item.name}({item.size ? 'L' : 'M'}) x{item.quantity}
                                        </div>
                                        <div className={cx('order-item-topping')}>
                                            Topping :{' '}
                                            {item.toppings.map((topping) => topping.name).join(', ') || 'Không'}
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
