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
import { DatePicker, Select, Table } from 'antd';
import { Col, Row } from 'react-bootstrap';
const cx = classNames.bind(styles);
const importColumns = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'idImport',
    },
    {
        title: 'Tên nguyên liệu',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'ĐVT',
        dataIndex: 'unitName',
        key: 'unitName',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isActive',
        key: 'isActive',
    },
    {
        title: 'Số lượng nhập',
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
function QuantityChange() {
    const [imports, setImports] = useState();
    const [exportsFromBH, setExportsFromBH] = useState();
    const [exports, setExports] = useState();
    const [type, setType] = useState('day');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const localStorageManager = LocalStorageManager.getInstance();

    const getIngredientReport = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await reportService.getIngredientReportByDate(date, token, type);
            if (results) {
                setImports(results.imports);
                setExportsFromBH(results.exportsBH);
                setExports(results.exportsWithoutBH);
            }
        }
    };
    useEffect(() => {
        getIngredientReport();
    }, [date, type]);
    console.log(imports);
    return (
        <div className={cx('content-wrapper')}>
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
                        <Table columns={importColumns} dataSource={imports} />
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default QuantityChange;
