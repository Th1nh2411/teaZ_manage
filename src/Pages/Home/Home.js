import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as orderService from '../../services/orderService';
import { StoreContext, actions } from '../../store';
import { timeGap } from '../../utils/format';
import { BsClipboardCheckFill, BsFillCartCheckFill, BsInfoCircle, BsXCircleFill } from 'react-icons/bs';
import { HiDocumentMinus } from 'react-icons/hi2';
import { RiEBike2Fill } from 'react-icons/ri';
import { FaFileInvoiceDollar } from 'react-icons/fa';

import Tippy from '@tippyjs/react';
import InvoiceList from './InvoiceList';
import ReceiptDetail from '../../components/ReceiptDetail/ReceiptDetail';
import { Badge, Popconfirm } from 'antd';
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
            } else {
                setIncompleteOrders([]);
            }
            if (results2.data) {
                setIncompleteOrders((prev) => [...results2.data, ...prev]);
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
        if (results) {
            state.showToast(results.message);

            await getAllInvoice();
        }
    };
    const donePreparedOrder = async (order) => {
        const results = await orderService.doneCookInvoice(order.id);
        if (results) {
            state.showToast(results.message);

            await getAllInvoice();
            await getAllInvoiceInTransit();
        }
    };
    const completeShipping = async (id) => {
        const results = await orderService.completeInvoice(id);
        if (results) {
            state.showToast(results.message);

            await getAllInvoiceInTransit();
        }
    };
    useEffect(() => {
        getAllInvoice();
        getAllInvoiceInTransit();

        const checkOrderInterval = setInterval(() => {
            getAllInvoice();
        }, 50000);

        return () => clearInterval(checkOrderInterval);
    }, []);
    const handleCancelInvoice = async (id) => {
        const results = await orderService.cancelInvoice(id);
        if (results) {
            state.showToast('Hủy đơn', results.message);
            getAllInvoice();
        }
    };
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
                                    {incompleteOrders ? incompleteOrders.length : 0} đơn
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
                                                    <Popconfirm
                                                        title="Xác nhận"
                                                        description={
                                                            order.status === 0
                                                                ? 'Xác nhận đơn đặt này?'
                                                                : 'Xác nhận hoàn thành pha chế đơn này?'
                                                        }
                                                        onConfirm={() =>
                                                            order.status === 0
                                                                ? completeOrder(order)
                                                                : donePreparedOrder(order)
                                                        }
                                                        okText="Xác nhận"
                                                        cancelText="Huỷ"
                                                    >
                                                        <span className={cx('order-item-actions')}>
                                                            {order.status === 0 ? (
                                                                <BsFillCartCheckFill />
                                                            ) : (
                                                                <BsClipboardCheckFill />
                                                            )}
                                                        </span>
                                                    </Popconfirm>
                                                    {order.status === 0 && (
                                                        <Popconfirm
                                                            title="Huỷ đơn"
                                                            description={'Huỷ đơn hàng này?'}
                                                            onConfirm={async () => {
                                                                await handleCancelInvoice(order.id);
                                                            }}
                                                            okText="Xác nhận"
                                                            cancelText="Huỷ"
                                                        >
                                                            <span
                                                                style={{ color: 'red' }}
                                                                className={cx('order-item-actions')}
                                                            >
                                                                <BsXCircleFill />
                                                            </span>
                                                        </Popconfirm>
                                                    )}
                                                </div>
                                            </div>
                                            {order.description && (
                                                <h4 style={{ marginBottom: 0, color: '#333' }}>
                                                    <span style={{ fontWeight: 600, textDecoration: 'underline' }}>
                                                        Ghi chú :
                                                    </span>{' '}
                                                    {order.description}
                                                </h4>
                                            )}
                                            <Badge
                                                status={
                                                    order.status === 0
                                                        ? 'error'
                                                        : order.status === 1
                                                        ? 'warning'
                                                        : order.status === 2
                                                        ? 'processing'
                                                        : order.status === 3
                                                        ? 'success'
                                                        : 'default'
                                                }
                                                text={
                                                    order.status === 0
                                                        ? 'Chưa xác nhận'
                                                        : order.status === 1
                                                        ? 'Đã xác nhận'
                                                        : order.status === 2
                                                        ? 'Đang giao'
                                                        : order.status === 3
                                                        ? 'Đã giao'
                                                        : 'Đã huỷ đơn'
                                                }
                                            />

                                            <div style={{ marginTop: 5 }}>
                                                {order.products &&
                                                    order.products.map((item, index) => (
                                                        <div key={index} className={cx('order-item-wrapper')}>
                                                            <Image src={item.image} className={cx('order-item-img')} />
                                                            <div className={cx('order-item-info')}>
                                                                <div className={cx('order-item-name')}>
                                                                    {item.name}({item.size ? 'L' : 'M'}) x
                                                                    {item.quantity}
                                                                </div>
                                                                <div className={cx('order-item-topping')}>
                                                                    Topping :{' '}
                                                                    {item.toppings
                                                                        .map((topping) => topping.name)
                                                                        .join(', ') || 'Không'}
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
                    </Col>
                    <Col md={6}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <RiEBike2Fill className={cx('icon')} />
                                    Đơn hàng đang giao
                                </div>
                                <div className={cx('content-subtitle')}>
                                    {completeOrders ? completeOrders.length : 0} đơn
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
                                                <Popconfirm
                                                    title="Giao hàng"
                                                    description={'Xác nhận giao xong đơn hàng này?'}
                                                    onConfirm={() => completeShipping(order.id)}
                                                    okText="Xác nhận"
                                                    cancelText="Huỷ"
                                                >
                                                    <div className={cx('order-item-actions')}>
                                                        <BsClipboardCheckFill />
                                                    </div>
                                                </Popconfirm>
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
