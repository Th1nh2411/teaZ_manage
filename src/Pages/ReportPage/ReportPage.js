import styles from './ReportPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as reportService from '../../services/reportService';
import { StoreContext, actions } from '../../store';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { formatNumber, formatPrice, priceFormat, timeGap } from '../../utils/format';

import Tippy from '@tippyjs/react';
import dayjs, { Dayjs } from 'dayjs';
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
import IngredientTracker from './IngredientTracker';
import Button from '../../components/Button/Button';
import ExportFile from '../../components/ExportFile';
import { DatePicker } from 'antd';
const cx = classNames.bind(styles);

function ReportPage() {
    const [reports, setReports] = useState();
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [type, setType] = useState(2);

    const [loading, setLoading] = useState(false);
    const localStorageManager = LocalStorageManager.getInstance();
    const getReport = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await reportService.getReportByDate(
                date,
                token,
                10,
                type === 1 ? 'day' : type === 2 ? 'month' : 'year',
            );
            setLoading(false);
            if (results) {
                setReports(results);
            }
        }
    };
    useEffect(() => {
        getReport();
    }, [date, type]);
    return (
        <div className={cx('wrapper')}>
            {loading ? (
                <div className={cx('loader')}>
                    <span />
                    <span />
                </div>
            ) : (
                <>
                    <div className={cx('header')}>
                        <div className={cx('header-title')}>Thống kê theo :</div>
                        <div className={cx('header-actions')}>
                            <Button primary={type === 1} onClick={() => setType(1)}>
                                Ngày
                            </Button>
                            <Button primary={type === 2} onClick={() => setType(2)}>
                                Tháng
                            </Button>
                            <Button primary={type === 3} onClick={() => setType(3)}>
                                Năm
                            </Button>
                        </div>
                        <DatePicker
                            picker={type === 1 ? 'date' : type === 2 ? 'month' : 'year'}
                            size="large"
                            value={dayjs(date)}
                            onChange={(date) => {
                                if (date) setDate(date.format('YYYY-MM-DD'));
                            }}
                        />
                    </div>
                    <Row>
                        <Col md={6} xl={3}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('report-wrapper')}>
                                    <ProfitIcon height="8rem" width="8rem" />
                                    <div className={cx('report-info')}>
                                        <div className={cx('report-title')}>Doanh thu</div>
                                        <div className={cx('report-num')}>
                                            {formatPrice(reports ? reports.total : 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} xl={3}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('report-wrapper')}>
                                    <DrinkIcon height="8rem" width="8rem" />
                                    <div className={cx('report-info')}>
                                        <div className={cx('report-title')}>Sản phẩm bán ra</div>
                                        <div className={cx('report-num')}>
                                            {formatNumber(reports ? reports.countProducts : 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} xl={3}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('report-wrapper')}>
                                    <JellyIcon height="8rem" width="8rem" />
                                    <div className={cx('report-info')}>
                                        <div className={cx('report-title')}>Topping dùng</div>
                                        <div className={cx('report-num')}>
                                            {formatNumber(reports ? reports.countToppings : 0)}{' '}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} xl={3}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('report-wrapper')}>
                                    <TruckDeliveryIcon height="8rem" width="8rem" />
                                    <div className={cx('report-info')}>
                                        <div className={cx('report-title')}>Tổng đơn hàng</div>
                                        <div className={cx('report-num')}>
                                            {formatNumber(reports ? reports.countInvoices : 0)}{' '}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        <RankingIcon height="3rem" width="3rem" className={cx('icon')} />
                                        Các món bán chạy
                                    </div>
                                    <div className={cx('content-subtitle')}>
                                        <ExportFile
                                            csvData={
                                                reports &&
                                                reports.topNames &&
                                                reports.topNames.map((item, index) => {
                                                    return {
                                                        id: item.idRecipe,
                                                        'Tên sản phẩm': item.name,
                                                        'Số lượng bán ra': item.count,
                                                    };
                                                })
                                            }
                                            fileName={
                                                type === 1
                                                    ? 'TopSellProduct' + dayjs(date).format('DD/MM/YYYY')
                                                    : type === 2
                                                    ? 'TopSellProduct' + dayjs(date).format('MM/YYYY')
                                                    : 'TopSellProduct' + dayjs(date).format('YYYY')
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={cx('content-body')}>
                                    {reports && reports.topNames && reports.topNames.length ? (
                                        reports.topNames.map((item, index) => (
                                            <div key={index} className={cx('product-wrapper')}>
                                                <div className={cx('product-content')}>
                                                    {index === 0 ? (
                                                        <FirstIcon className={cx('ranking-icon')} />
                                                    ) : index === 1 ? (
                                                        <SecondIcon className={cx('ranking-icon')} />
                                                    ) : index === 2 ? (
                                                        <ThirdIcon className={cx('ranking-icon')} />
                                                    ) : (
                                                        <div className={cx('ranking-icon')}>{index + 1}. </div>
                                                    )}
                                                    <div className={cx('product-img-wrapper')}>
                                                        <Image src={item.image} className={cx('product-img')} />
                                                    </div>
                                                    <div className={cx('product-info')}>
                                                        <div className={cx('product-name')}>{item.name}</div>
                                                        {item.price && (
                                                            <div className={cx('product-price')}>{item.price}.000đ</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={cx('product-quantity')}>{item.count}sp</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={cx('empty-order-wrapper')}>
                                            <Image src={images.emptyCart} className={cx('empty-order-img')} />
                                            <div className={cx('empty-order-title')}>Chưa có đơn hàng nào</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        <RankingIcon height="3rem" width="3rem" className={cx('icon')} />
                                        Các topping sử dụng nhiều
                                    </div>
                                    <div className={cx('content-subtitle')}>
                                        <ExportFile
                                            csvData={
                                                reports &&
                                                reports.topNames &&
                                                reports.topNames.map((item, index) => {
                                                    return {
                                                        id: item.idRecipe,
                                                        'Tên topping': item.name,
                                                        'Số lượng sử dụng': item.count,
                                                    };
                                                })
                                            }
                                            fileName={
                                                type === 1
                                                    ? 'TopSellTopping' + dayjs(date).format('DD/MM/YYYY')
                                                    : type === 2
                                                    ? 'TopSellTopping' + dayjs(date).format('MM/YYYY')
                                                    : 'TopSellTopping' + dayjs(date).format('YYYY')
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={cx('content-body')}>
                                    {reports && reports.topToppings && reports.topToppings.length ? (
                                        reports.topToppings.map((item, index) => (
                                            <div key={index} className={cx('product-wrapper')}>
                                                <div className={cx('product-content')}>
                                                    {index === 0 ? (
                                                        <FirstIcon className={cx('ranking-icon')} />
                                                    ) : index === 1 ? (
                                                        <SecondIcon className={cx('ranking-icon')} />
                                                    ) : index === 2 ? (
                                                        <ThirdIcon className={cx('ranking-icon')} />
                                                    ) : (
                                                        <div className={cx('ranking-icon')}>{index + 1}. </div>
                                                    )}
                                                    <div className={cx('product-img-wrapper')}>
                                                        <Image src={item.image} className={cx('product-img')} />
                                                    </div>
                                                    <div className={cx('product-info')}>
                                                        <div className={cx('product-name')}>{item.name}</div>
                                                        {item.price && (
                                                            <div className={cx('product-price')}>{item.price}.000đ</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={cx('product-quantity')}>{item.count}sp</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={cx('empty-order-wrapper')}>
                                            <Image src={images.emptyCart} className={cx('empty-order-img')} />
                                            <div className={cx('empty-order-title')}>Chưa có đơn hàng nào</div>
                                        </div>
                                    )}
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
                                        Biểu đồ lợi nhuận
                                    </div>
                                    <div className={cx('content-subtitle')}></div>
                                </div>
                                <div className={cx('content-body')}>
                                    <ProfitTracker />
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        <BarChartIcon height="3rem" width="3rem" className={cx('icon')} />
                                        Thống kê nhập/xuất nguyên liệu
                                    </div>
                                    <div className={cx('content-subtitle')}></div>
                                </div>
                                <div className={cx('content-body')}>
                                    <IngredientTracker date={date} type={type} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default ReportPage;
