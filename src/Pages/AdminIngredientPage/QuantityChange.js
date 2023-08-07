import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { useContext, useEffect, useState } from 'react';
import * as reportService from '../../services/reportService';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { priceFormat, timeGap } from '../../utils/format';
import { FaFileInvoiceDollar } from 'react-icons/fa';

import Tippy from '@tippyjs/react';
import dayjs from 'dayjs';
import { DatePicker, Divider, Select, Table } from 'antd';
import { Col, Row } from 'react-bootstrap';
import ExportFile from '../../components/ExportFile/ExportFile';
const cx = classNames.bind(styles);
const importColumns = [
    {
        title: 'id',
        dataIndex: 'idIngredient',
        key: 'idIngredient',
    },
    {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'ĐVT',
        dataIndex: 'unitName',
        key: 'unitName',
    },
    {
        title: 'SL',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Ngày nhập',
        dataIndex: 'date',
        key: 'date',
    },
];
const exportColumns = [
    {
        title: 'id',
        dataIndex: 'idIngredient',
        key: 'idIngredient',
    },
    {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'ĐVT',
        dataIndex: 'unitName',
        key: 'unitName',
    },
    {
        title: 'SL',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Ghi chú',
        dataIndex: 'info',
        key: 'info',
    },
    {
        title: 'Ngày xuất',
        dataIndex: 'date',
        key: 'date',
    },
];
function QuantityChange() {
    const [imports, setImports] = useState([]);
    const [exportsFromBH, setExportsFromBH] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exports, setExports] = useState([]);
    const [type, setType] = useState('day');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const localStorageManager = LocalStorageManager.getInstance();

    const getIngredientReport = async () => {
        const token = localStorageManager.getItem('token');
        setLoading(true);
        if (token) {
            const results = await reportService.getIngredientReportByDate(date, token, type);
            if (results && results.isSuccess) {
                setImports(
                    results.imports.map((item) => {
                        return {
                            ...item,
                            total: priceFormat(item.total) + 'đ',
                            date: item.date,
                        };
                    }),
                );
                setExportsFromBH(
                    results.exportsBH.map((item) => {
                        return {
                            ...item,
                            date: item.date,
                        };
                    }),
                );
                setExports(
                    results.exportsWithoutBH.map((item) => {
                        return {
                            ...item,
                            date: item.date,
                        };
                    }),
                );
            }
        }
        setLoading(false);
    };
    useEffect(() => {
        getIngredientReport();
    }, [date, type]);
    console.log(imports);
    return (
        <div className={cx('content-wrapper', 'mt-4')}>
            <div className={cx('content-header')}>
                <div className={cx('content-title')}>
                    <FaFileInvoiceDollar className={cx('icon', 'highlight')} />
                    Lịch sử nhập, xuất nguyên liệu
                </div>
                <div>
                    <DatePicker
                        picker={type}
                        size="large"
                        value={dayjs(date)}
                        onChange={(date) => {
                            if (date) setDate(date.format('YYYY-MM-DD'));
                        }}
                    />
                </div>
                <div className={cx('content-subtitle')}>
                    <Select
                        value={type}
                        style={{
                            width: 120,
                        }}
                        onChange={(value) => setType(value)}
                        options={[
                            {
                                value: 'day',
                                label: 'Theo ngày',
                            },
                            {
                                value: 'month',
                                label: 'Theo tháng',
                            },
                            {
                                value: 'year',
                                label: 'Theo năm',
                            },
                        ]}
                    />
                </div>
            </div>
            <div className={cx('content-body')}>
                <Row>
                    <Col>
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
                            size="small"
                            pagination={{
                                defaultPageSize: 5,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '30'],
                            }}
                            loading={loading}
                            bordered
                            columns={importColumns}
                            dataSource={imports}
                        />
                    </Col>
                    <Col>
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
                            size="small"
                            pagination={{
                                defaultPageSize: 5,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '30'],
                            }}
                            loading={loading}
                            bordered
                            columns={exportColumns}
                            dataSource={exports}
                        />
                    </Col>
                    <Col>
                        <Divider>
                            <div className={cx('d-flex', 'align-items-center')}>
                                Bán hàng{' '}
                                <ExportFile
                                    csvData={exportsFromBH.map((item) => {
                                        return {
                                            id: item.idIngredient,
                                            'Tên sản phẩm': item.name,
                                            ĐVT: item.unitName,
                                            'Số lượng': item.quantity,
                                            'Ghi chú': item.info,
                                            'Ngày nhập': item.date,
                                        };
                                    })}
                                    fileName="SellIngredient"
                                />
                            </div>
                        </Divider>
                        <Table
                            size="small"
                            pagination={{
                                showSizeChanger: false,
                                showLessItems: true,
                            }}
                            loading={loading}
                            bordered
                            columns={exportColumns}
                            dataSource={exportsFromBH}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default QuantityChange;
