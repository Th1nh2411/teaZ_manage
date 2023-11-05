import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as orderService from '../../services/orderService';
import { StoreContext, actions } from '../../store';
import { priceFormat, timeGap } from '../../utils/format';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { Badge, Select } from 'antd';
import Tippy from '@tippyjs/react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);

const { Option } = Select;

function InvoiceList({ invoiceChange }) {
    const [invoices, setInvoices] = useState();
    const [fromdate, setFromdate] = useState();
    const [todate, setTodate] = useState();
    const [status, setStatus] = useState();

    const getAllInvoiceByDate = async () => {
        const results = await orderService.getAllInvoiceByDateAndStatus(
            fromdate && fromdate.format('YYYY-MM-DD'),
            todate && todate.format('YYYY-MM-DD'),
            status,
        );
        if (results) {
            setInvoices(results.data);
        }
    };

    useEffect(() => {
        getAllInvoiceByDate();
    }, [fromdate, todate, invoiceChange, status]);
    return (
        <div className={cx('content-wrapper')}>
            <div className={cx('content-header')}>
                <div className={cx('content-title')}>
                    <FaFileInvoiceDollar className={cx('icon', 'highlight')} />
                    Danh sách hóa đơn
                </div>
                <RangePicker
                    disabledDate={(current) => {
                        return current && current > dayjs().endOf('day');
                    }}
                    value={[fromdate, todate]}
                    size="large"
                    onChange={(dates) => {
                        setFromdate(dates ? dates[0] : null);
                        setTodate(dates ? dates[1] : null);
                    }}
                    format="DD/MM/YYYY"
                />
                <Select
                    size="large"
                    value={status}
                    onChange={(value) => {
                        setStatus(value);
                    }}
                    placeholder="Chọn trạng thái"
                    allowClear
                    style={{ minWidth: 140 }}
                >
                    <Option value="0">Chưa xác nhận</Option>
                    <Option value="1">Đã xác nhận</Option>
                    <Option value="2">Đang giao</Option>
                    <Option value="3">Hoàn thành</Option>
                    <Option value="4">Đã huỷ</Option>
                </Select>
                <div className={cx('content-subtitle')}>{invoices ? invoices.length : 0} đơn</div>
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
                            {invoice.description && (
                                <h4 style={{ marginBottom: 0, color: '#333' }}>
                                    <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Ghi chú :</span>{' '}
                                    {invoice.description}
                                </h4>
                            )}
                            <Badge
                                status={
                                    invoice.status === 0
                                        ? 'error'
                                        : invoice.status === 1
                                        ? 'warning'
                                        : invoice.status === 2
                                        ? 'processing'
                                        : invoice.status === 3
                                        ? 'success'
                                        : 'default'
                                }
                                text={
                                    invoice.status === 0
                                        ? 'Chưa xác nhận'
                                        : invoice.status === 1
                                        ? 'Đã xác nhận'
                                        : invoice.status === 2
                                        ? 'Đang giao'
                                        : invoice.status === 3
                                        ? 'Đã giao'
                                        : 'Đã huỷ đơn'
                                }
                            />
                            <div style={{ marginTop: 5 }}>
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
