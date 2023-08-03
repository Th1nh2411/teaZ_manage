import styles from './AdminReportPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Calendar from '../../components/Calendar';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import { StoreContext, actions } from '../../store';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { formatNumber, priceFormat, timeGap } from '../../utils/format';

import Tippy from '@tippyjs/react';
import {
    LineChartIcon,
    DrinkIcon,
    FirstIcon,
    JellyIcon,
    ProfitIcon,
    RankingIcon,
    SecondIcon,
    ThirdIcon,
    TruckDeliveryIcon,
    BarChartIcon,
} from '../../components/Icons/Icons';
import { BsClipboardCheckFill } from 'react-icons/bs';
import OrderItem from '../../components/OrderItem';
import ProfitTracker from './ProfitTracker';
import Button from '../../components/Button/Button';
import CompareTracker from './CompareTracker';
const cx = classNames.bind(styles);

function AdminReportPage() {
    const [allShopReports, setAllShopReports] = useState();
    const [shopReport, setShopReport] = useState();

    const [loading, setLoading] = useState(false);
    const localStorageManager = LocalStorageManager.getInstance();
    const get6ReportByShop = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await adminService.getDataForChartByShop(token);
            setLoading(false);
            if (results) {
                setShopReport(results);
            }
        }
    };
    const get6ReportAllShop = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await adminService.getAllShopDataForChart(token);
            setLoading(false);
            if (results) {
                setAllShopReports(results.listTotalAndTotalAmountImport);
            }
        }
    };
    useEffect(() => {
        get6ReportAllShop();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {loading ? (
                <div className={cx('loader')}>
                    <span />
                    <span />
                </div>
            ) : (
                <>
                    <Row>
                        <Col md={6}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('report-wrapper')}>
                                    <ProfitIcon height="8rem" width="8rem" />
                                    <div className={cx('report-info')}>
                                        <div className={cx('report-title')}>Doanh thu</div>
                                        <div className={cx('report-num')}>
                                            {formatNumber(
                                                allShopReports && allShopReports[allShopReports.length - 1]
                                                    ? allShopReports[allShopReports.length - 1].total
                                                    : 0,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('report-wrapper')}>
                                    <TruckDeliveryIcon height="8rem" width="8rem" />
                                    <div className={cx('report-info')}>
                                        <div className={cx('report-title')}>Tổng đơn hàng</div>
                                        <div className={cx('report-num')}>
                                            {formatNumber(
                                                allShopReports && allShopReports[allShopReports.length - 1]
                                                    ? allShopReports[allShopReports.length - 1].countInvoices
                                                    : 0,
                                            )}{' '}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        <BarChartIcon height="3rem" width="3rem" className={cx('icon')} />
                                        Biểu đồ lợi nhuận chuỗi cửa hàng
                                    </div>
                                    <div className={cx('content-subtitle')}></div>
                                </div>
                                <div className={cx('content-body')}>
                                    <ProfitTracker chartData={allShopReports} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        <LineChartIcon height="3rem" width="3rem" className={cx('icon')} />
                                        Biểu đồ so sánh doanh thu các cửa hàng
                                    </div>
                                    <div className={cx('content-subtitle')}></div>
                                </div>
                                <div className={cx('content-body')}>
                                    <CompareTracker />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default AdminReportPage;
