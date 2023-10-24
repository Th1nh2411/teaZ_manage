import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { useContext, useEffect, useState } from 'react';
import * as shopService from '../../services/shopService';
import * as ingredientService from '../../services/ingredientService';
import { priceFormat, timeGap } from '../../utils/format';
import { FaFileInvoiceDollar } from 'react-icons/fa';

import Tippy from '@tippyjs/react';
import dayjs from 'dayjs';
import { DatePicker, Divider, Select, Table } from 'antd';
import { Col, Row } from 'antd';
import ExportFile from '../../components/ExportFile/ExportFile';
import staticMethods from 'antd/es/message';
import { StoreContext } from '../../store';
import DetailChange from './DetailChange';
const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);

function QuantityChange() {
    const [loading, setLoading] = useState(false);
    const [imports, setImports] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [exports, setExports] = useState([]);
    const [detailChange, setDetailChange] = useState(false);
    const [fromdate, setFromdate] = useState();
    const [todate, setTodate] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const tableColumns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isCompleted',
            key: 'isCompleted',
            filters: [
                {
                    text: 'Hoàn thành',
                    value: 'Hoàn thành',
                },
                {
                    text: 'Chưa hoàn thành',
                    value: 'Chưa hoàn thành',
                },
                {
                    text: 'Đã huỷ',
                    value: 'Đã huỷ',
                },
            ],
            onFilter: (value, record) => record.isCompleted === value,
        },
        {
            title: 'Nhân viên',
            dataIndex: 'staff',
            key: 'staff',
            filters: staffs.map((item) => {
                return { text: item.name, value: item.name };
            }),
            onFilter: (value, record) => record.staff === value,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Ngày nhập',
            dataIndex: 'date',
            key: 'date',
        },
    ];
    const getIngredientReport = async () => {
        setLoading(true);
        const results = await ingredientService.getAllImport({
            fromdate: fromdate && fromdate.format('YYYY-MM-DD'),
            todate: todate && todate.format('YYYY-MM-DD'),
        });
        if (results) {
            setImports(
                results.data.map((item) => {
                    return {
                        ...item,
                        isCompleted:
                            item.isCompleted === 1
                                ? 'Hoàn thành'
                                : item.isCompleted === 0
                                ? 'Chưa hoàn thành'
                                : 'Đã huỷ',
                        date: dayjs(item.date).format('DD/MM/YYYY'),
                        total: priceFormat(item.total) + 'đ',
                        staff: item.staff.name,
                    };
                }),
            );
        }
        const results2 = await ingredientService.getAllExport({
            fromdate: fromdate && fromdate.format('YYYY-MM-DD'),
            todate: todate && todate.format('YYYY-MM-DD'),
        });
        if (results2) {
            setExports(
                results2.data.map((item) => {
                    return {
                        ...item,
                        isCompleted:
                            item.isCompleted === 1
                                ? 'Hoàn thành'
                                : item.isCompleted === 0
                                ? 'Chưa hoàn thành'
                                : 'Đã huỷ',
                        date: dayjs(item.date).format('DD/MM/YYYY'),
                        total: priceFormat(item.total) + 'đ',
                        staff: item.staff.name,
                    };
                }),
            );
        }
        setLoading(false);
    };
    const getListStaff = async () => {
        const results = await shopService.getListStaff();
        if (results) {
            setStaffs(results.data.concat(state.userInfo));
        }
    };

    useEffect(() => {
        getIngredientReport();
        getListStaff();
    }, [fromdate, todate]);
    return (
        <>
            {detailChange && (
                <DetailChange
                    id={detailChange.id}
                    type={detailChange.type}
                    onCloseModal={() => setDetailChange(false)}
                />
            )}
            <div className={cx('content-wrapper', 'mt-4')}>
                <div className={cx('content-header')}>
                    <div className={cx('content-title')}>
                        <FaFileInvoiceDollar className={cx('icon', 'highlight')} />
                        Lịch sử nhập, xuất nguyên liệu
                    </div>

                    <div className={cx('content-subtitle')}>
                        <div>
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
                        </div>
                    </div>
                </div>
                <div style={{ maxHeight: 'fit-content' }} className={cx('content-body')}>
                    <Row gutter={[15, 15]}>
                        <Col xs={24} xl={12}>
                            <Divider>
                                <div className={cx('d-flex', 'align-items-center')}>
                                    Nhập hàng{' '}
                                    <ExportFile
                                        csvData={imports.map((item) => {
                                            return {
                                                id: item.idIngredient,
                                                'Tên sản phẩm': item.name,
                                                ĐVT: item.unitName,
                                                'Số lượng': item.quantity,
                                                'Tổng tiền': priceFormat(item.total) + 'đ',
                                                'Ngày nhập': item.date,
                                            };
                                        })}
                                        fileName="importIngredient"
                                    />
                                </div>
                            </Divider>
                            <Table
                                onRow={(record) => {
                                    return {
                                        onClick: () => setDetailChange(record),
                                        style: { cursor: 'pointer' },
                                    };
                                }}
                                size="small"
                                pagination={{
                                    defaultPageSize: 5,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '30'],
                                }}
                                loading={loading}
                                bordered
                                columns={tableColumns}
                                dataSource={imports}
                            />
                        </Col>
                        <Col xs={24} xl={12}>
                            <Divider>
                                <div className={cx('d-flex', 'align-items-center')}>
                                    Xuất hàng{' '}
                                    <ExportFile
                                        csvData={exports.map((item) => {
                                            return {
                                                id: item.idIngredient,
                                                'Tên sản phẩm': item.name,
                                                ĐVT: item.unitName,
                                                'Số lượng': item.quantity,
                                                'Ghi chú': item.info,
                                                'Ngày nhập': item.date,
                                            };
                                        })}
                                        fileName="exportIngredient"
                                    />
                                </div>
                            </Divider>
                            <Table
                                onRow={(record) => {
                                    return {
                                        onClick: () => setDetailChange({ ...record, type: 'export' }),
                                        style: { cursor: 'pointer' },
                                    };
                                }}
                                size="small"
                                pagination={{
                                    defaultPageSize: 5,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '30'],
                                }}
                                loading={loading}
                                bordered
                                columns={tableColumns}
                                dataSource={exports}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default QuantityChange;
