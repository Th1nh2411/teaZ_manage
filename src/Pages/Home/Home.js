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
import { timeGap } from '../../utils/format';
import { BsClipboardCheckFill } from 'react-icons/bs';
import { HiDocumentMinus } from 'react-icons/hi2';
import { RiEBike2Fill } from 'react-icons/ri';
import { FaFileInvoiceDollar } from 'react-icons/fa';

import Tippy from '@tippyjs/react';
import InvoiceList from './InvoiceList';
const cx = classNames.bind(styles);

function Home() {
    const [incompleteOrders, setIncompleteOrders] = useState([]);
    const [completeOrders, setCompleteOrders] = useState([]);
    const [loading, setLoading] = useState();

    const localStorageManager = LocalStorageManager.getInstance();
    const getAllOrder = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await orderService.getAllOrder(token);
            if (results) {
                setIncompleteOrders(results.invoices);
            }
            setLoading(false);
        }
    };
    const getAllOrderInTransit = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await orderService.getAllOrderInTransit(token);
            if (results) {
                setCompleteOrders(results.invoices);
            }
        }
    };
    const completeOrder = async (idInvoice) => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await orderService.completeOrder(idInvoice, token);
        }
        getAllOrder();
        getAllOrderInTransit();
    };
    const completeShipping = async (idInvoice) => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await orderService.completeInvoice(idInvoice, token);
        }
        getAllOrderInTransit();
    };
    useEffect(() => {
        getAllOrder();
        getAllOrderInTransit();

        const checkOrderInterval = setInterval(() => {
            getAllOrder();
        }, 100000);

        return () => clearInterval(checkOrderInterval);
    }, []);
    return (
        <div className={cx('wrapper')}>
            {loading ? (
                <div className={cx('loader')}>
                    <span />
                    <span />
                </div>
            ) : (
                <Row>
                    <Col md={6}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <HiDocumentMinus className={cx('icon', 'warning')} />
                                    Đơn hàng chưa hoàn thành
                                </div>
                                <div className={cx('content-subtitle')}>
                                    {incompleteOrders && incompleteOrders.length} đơn
                                </div>
                            </div>
                            <div className={cx('content-body')}>
                                {incompleteOrders && incompleteOrders.length !== 0 ? (
                                    incompleteOrders.map((order, index) => (
                                        <div key={index} className={cx('order-list')}>
                                            <div className={cx('order-header')}>
                                                <div className={cx('order-title')}>
                                                    Đơn {order.idInvoices} - {timeGap(order.date)}
                                                </div>
                                                <Tippy content="Hoàn thành đơn" placement="bottom" duration={0}>
                                                    <div
                                                        onClick={() => completeOrder(order.idInvoices)}
                                                        className={cx('order-item-actions')}
                                                    >
                                                        <BsClipboardCheckFill />
                                                    </div>
                                                </Tippy>
                                            </div>
                                            {order.detail.map((item, index) => (
                                                <div key={index} className={cx('order-item-wrapper')}>
                                                    <Image src={item.image} className={cx('order-item-img')} />
                                                    <div className={cx('order-item-info')}>
                                                        <div className={cx('order-item-name')}>
                                                            {item.name}({item.size ? 'L' : 'M'}) x{item.quantityProduct}
                                                        </div>
                                                        <div className={cx('order-item-topping')}>
                                                            Topping :{' '}
                                                            {item.listTopping
                                                                .map((topping) => topping.name)
                                                                .join(', ') || 'Không'}
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
                    </Col>
                    <Col md={6}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <RiEBike2Fill className={cx('icon')} />
                                    Đơn hàng đang giao
                                </div>
                                <div className={cx('content-subtitle')}>
                                    {completeOrders && completeOrders.length} đơn
                                </div>
                            </div>
                            <div className={cx('content-body')}>
                                {completeOrders && completeOrders.length !== 0 ? (
                                    completeOrders.map((order, index) => (
                                        <div key={index} className={cx('order-list')}>
                                            <div className={cx('order-header')}>
                                                <div className={cx('order-title')}>
                                                    Đơn {order.idInvoices} - {timeGap(order.date)}
                                                </div>
                                                <Tippy content="Hoàn thành giao" placement="bottom" duration={0}>
                                                    <div
                                                        onClick={() => completeShipping(order.idInvoices)}
                                                        className={cx('order-item-actions')}
                                                    >
                                                        <BsClipboardCheckFill />
                                                    </div>
                                                </Tippy>
                                            </div>
                                            {order.detail.map((item, index) => (
                                                <div key={index} className={cx('order-item-wrapper')}>
                                                    <Image src={item.image} className={cx('order-item-img')} />
                                                    <div className={cx('order-item-info')}>
                                                        <div className={cx('order-item-name')}>
                                                            {item.name}({item.size ? 'L' : 'M'}) x{item.quantityProduct}
                                                        </div>
                                                        <div className={cx('order-item-topping')}>
                                                            Topping :{' '}
                                                            {item.listTopping
                                                                .map((topping) => topping.name)
                                                                .join(', ') || 'Không'}
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
                    </Col>
                    <Col>
                        <InvoiceList />
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default Home;
