import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as orderService from '../../services/orderService';
import { StoreContext, actions } from '../../store';
import { timeGap } from '../../utils/format';
import { BsClipboardCheckFill, BsInfoCircle, BsXCircleFill } from 'react-icons/bs';
import { HiDocumentMinus } from 'react-icons/hi2';
import { RiEBike2Fill } from 'react-icons/ri';
import { FaFileInvoiceDollar } from 'react-icons/fa';

import Tippy from '@tippyjs/react';
import InvoiceList from './InvoiceList';
import ReceiptDetail from '../../components/ReceiptDetail/ReceiptDetail';
const cx = classNames.bind(styles);

function Home() {
    const [state, dispatch] = useContext(StoreContext);
    const [incompleteOrders, setIncompleteOrders] = useState([]);
    const [completeOrders, setCompleteOrders] = useState([]);
    const [showDetailReceipt, setShowDetailReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(false);

    const getAllInvoice = async () => {
        const results1 = await orderService.getAllUnConfirmedInvoice();
        const results2 = await orderService.getAllConfirmedInvoice();
        if (results1 && results2) {
            if (results1.data) {
                setIncompleteOrders([...results1.data]);
            }
            if (results2.data) {
                setIncompleteOrders((prev) => [prev, ...results2.data]);
            }
        }
    };
    const getAllInvoiceInTransit = async () => {
        const results = await orderService.getAllInvoiceInTransit();
        if (results) {
            setCompleteOrders(results.data);
        }
    };
    const completeOrder = async (order) => {
        const results = await orderService.confirmInvoice(order.id);
        dispatch(
            actions.setToast({
                show: true,
                content: results.message,
                title: 'Thành công',
            }),
        );
        getAllInvoice();
        getAllInvoiceInTransit();
    };
    const completeShipping = async (id) => {
        const results = await orderService.completeInvoice(id);
        if (results.isSuccess) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: 'Giao hàng thành công',
                    title: 'Thành công',
                }),
            );
        }
        getAllInvoiceInTransit();
    };
    useEffect(() => {
        getAllInvoice();
        getAllInvoiceInTransit();

        const checkOrderInterval = setInterval(() => {
            getAllInvoice();
        }, 10000);

        return () => clearInterval(checkOrderInterval);
    }, []);
    const handleCancelInvoice = async (id) => {
        try {
            const results = await orderService.cancelInvoice(id);
            dispatch(actions.setToast({ show: true, title: 'Hủy đơn', content: results.message }));
            getAllInvoice();
        } catch (error) {
            dispatch(actions.setToast({ show: true, title: 'Hủy đơn', content: error.response.message, type: 'info' }));
        }
    };
    console.log(incompleteOrders);
    return (
        <>
            {showDetailReceipt && <ReceiptDetail data={receiptData} onCloseModal={() => setShowDetailReceipt(false)} />}
            <div className={cx('wrapper')}>
                <Row>
                    <Col md={6}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <HiDocumentMinus className={cx('icon', 'warning')} />
                                    Đơn hàng chưa xác nhận
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
                                                    Đơn {order.id} - {timeGap(order.date)}{' '}
                                                    <BsInfoCircle
                                                        className={cx('icon')}
                                                        onClick={() => {
                                                            setShowDetailReceipt(true);
                                                            setReceiptData(order);
                                                        }}
                                                    />
                                                </div>
                                                <div className={cx('d-flex', 'align-items-center')}>
                                                    <Tippy content="Xác nhận đơn hàng" placement="bottom" duration={0}>
                                                        <div
                                                            onClick={() => completeOrder(order)}
                                                            className={cx('order-item-actions')}
                                                        >
                                                            <BsClipboardCheckFill />
                                                        </div>
                                                    </Tippy>
                                                    <Tippy content="Huỷ đơn" placement="bottom" duration={0}>
                                                        <div
                                                            onClick={async () => {
                                                                if (window.confirm('Xác nhận huỷ đơn này?')) {
                                                                    await handleCancelInvoice(order.id);
                                                                }
                                                            }}
                                                            style={{ color: 'red' }}
                                                            className={cx('order-item-actions')}
                                                        >
                                                            <BsXCircleFill />
                                                        </div>
                                                    </Tippy>
                                                </div>
                                            </div>
                                            {order.products.map((item, index) => (
                                                <div key={index} className={cx('order-item-wrapper')}>
                                                    <Image src={item.image} className={cx('order-item-img')} />
                                                    <div className={cx('order-item-info')}>
                                                        <div className={cx('order-item-name')}>
                                                            {item.name}({item.size ? 'L' : 'M'}) x{item.quantity}
                                                        </div>
                                                        <div className={cx('order-item-topping')}>
                                                            Topping :{' '}
                                                            {item.toppings.map((topping) => topping.name).join(', ') ||
                                                                'Không'}
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
                                                    Đơn {order.id} - {timeGap(order.date)}
                                                    <BsInfoCircle
                                                        className={cx('icon')}
                                                        onClick={() => {
                                                            setShowDetailReceipt(true);
                                                            setReceiptData(order);
                                                        }}
                                                    />
                                                </div>
                                                <Tippy content="Hoàn thành giao" placement="bottom" duration={0}>
                                                    <div
                                                        onClick={() => completeShipping(order.id)}
                                                        className={cx('order-item-actions')}
                                                    >
                                                        <BsClipboardCheckFill />
                                                    </div>
                                                </Tippy>
                                            </div>
                                            {order.products.map((item, index) => (
                                                <div key={index} className={cx('order-item-wrapper')}>
                                                    <Image src={item.image} className={cx('order-item-img')} />
                                                    <div className={cx('order-item-info')}>
                                                        <div className={cx('order-item-name')}>
                                                            {item.name}({item.size ? 'L' : 'M'}) x{item.quantity}
                                                        </div>
                                                        <div className={cx('order-item-topping')}>
                                                            Topping :{' '}
                                                            {item.toppings.map((topping) => topping.name).join(', ') ||
                                                                'Không'}
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
            </div>
        </>
    );
}

export default Home;
