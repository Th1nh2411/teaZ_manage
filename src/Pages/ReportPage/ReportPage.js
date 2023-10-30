import styles from './ReportPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { useContext, useEffect, useState } from 'react';
import * as reportService from '../../services/reportService';
import { StoreContext, actions } from '../../store';
import { formatNumber, priceFormatReport, priceFormat, timeGap } from '../../utils/format';

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
import ProfitTracker from './ProfitTracker';
import IngredientTracker from './IngredientTracker';
import Button from '../../components/Button/Button';
import ExportFile from '../../components/ExportFile';
import { Col, DatePicker, Row } from 'antd';
const cx = classNames.bind(styles);
const { RangePicker } = DatePicker;

function ReportPage() {
    const [reports, setReports] = useState();
    const [fromdate, setFromdate] = useState();
    const [todate, setTodate] = useState();

    const [loading, setLoading] = useState(false);
    const getReport = async () => {
        setLoading(true);
        const results = await reportService.getReportByDate(
            fromdate && fromdate.format('YYYY-MM-DD'),
            todate && todate.format('YYYY-MM-DD'),
        );
        setLoading(false);
        if (results) {
            setReports(results);
        }
    };
    useEffect(() => {
        getReport();
    }, [fromdate, todate]);
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
                        <div className={cx('header-title')}>Chọn thời gian :</div>

                        <RangePicker
                            disabledDate={(current) => {
                                return current && current > dayjs().endOf('day');
                            }}
                            size="large"
                            value={[fromdate, todate]}
                            onChange={(dates) => {
                                setFromdate(dates ? dates[0] : null);
                                setTodate(dates ? dates[1] : null);
                            }}
                            format="DD/MM/YYYY"
                        />
                    </div>
                    <Row gutter={[15]}>
                        <Col md={12} xl={6} xs={24}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('report-wrapper')}>
                                    <ProfitIcon height="8rem" width="8rem" />
                                    <div className={cx('report-info')}>
                                        <div className={cx('report-title')}>Doanh thu</div>
                                        <div className={cx('report-num')}>
                                            {priceFormatReport(reports ? reports.revenue : 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={12} xl={6} xs={24}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('report-wrapper')}>
                                    <DrinkIcon height="8rem" width="8rem" />
                                    <div className={cx('report-info')}>
                                        <div className={cx('report-title')}>Sản phẩm bán ra</div>
                                        <div className={cx('report-num')}>
                                            {formatNumber(reports ? reports.countRecipes : 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={12} xl={6} xs={24}>
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
                        <Col md={12} xl={6} xs={24}>
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
                    <Row gutter={15}>
                        <Col lg={12} xs={24}>
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
                                            fileName={'TopSellProduct'}
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
                        <Col lg={12} xs={24}>
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
                                            fileName={'TopSellTopping'}
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
                    <Row gutter={15}>
                        <Col lg={12} xs={24}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        <LineChartIcon height="3rem" width="3rem" className={cx('icon')} />
                                        Biểu đồ lợi nhuận
                                    </div>
                                    <div className={cx('content-subtitle')}></div>
                                </div>
                                <div className={cx('content-body')}>
                                    <ProfitTracker reportData={reports} />
                                </div>
                            </div>
                        </Col>
                        <Col lg={12} xs={24}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content-header')}>
                                    <div className={cx('content-title')}>
                                        <BarChartIcon height="3rem" width="3rem" className={cx('icon')} />
                                        Thống kê nhập/xuất nguyên liệu
                                    </div>
                                    <div className={cx('content-subtitle')}></div>
                                </div>
                                <div className={cx('content-body')}>
                                    <IngredientTracker
                                        reportData={reports && reports.importExportIngredients}
                                        date={fromdate}
                                    />
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
