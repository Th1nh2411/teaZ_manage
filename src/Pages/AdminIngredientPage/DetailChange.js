import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
// import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import * as ingredientService from '../../services/ingredientService';
import { Badge, Col, Descriptions, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { priceFormat, unitFormatL } from '../../utils/format';

const cx = classNames.bind(styles);

function DetailChange({ id, onCloseModal = () => {}, type = 'import' }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const getDetailChange = async () => {
        setLoading(true);
        const results =
            type === 'import'
                ? await ingredientService.getDetailImport(id)
                : await ingredientService.getDetailExport(id);
        if (results) {
            setData(results);
        }
        setLoading(false);
    };
    const items = [
        {
            key: '1',
            label: 'Thời gian tạo',
            children: data && dayjs(data.date).format('HH:mm DD/MM/YYYY'),
        },
        {
            key: '2',
            label: 'Mô tả',
            children: data && data.description,
        },
        {
            key: '3',
            label: 'Nhân viên xử lý',
            children: data && data.staff.name,
        },
        {
            key: '4',
            label: 'Trạng thái',
            children: data && (
                <Badge
                    status={data.isCompleted === 1 ? 'success' : data.isCompleted === 0 ? 'error' : 'default'}
                    text={
                        data.isCompleted === 1 ? 'Đã hoàn thành' : data.isCompleted === 0 ? 'Chưa hoàn thành' : 'Đã huỷ'
                    }
                />
            ),
        },
        {
            key: '5',
            label: 'Tổng tiền',
            children: data && data.description,
        },
    ];
    useEffect(() => {
        getDetailChange();
    }, []);
    const tableColumns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'ĐVT',
            dataIndex: 'unitName',
            key: 'unitName',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
    ];
    return (
        <>
            <Modal
                handleClickOutside={() => {
                    onCloseModal();
                }}
                className={cx('form-wrapper')}
            >
                <div className={cx('form-title')}>Chi tiết {type === 'import' ? 'nhập hàng' : 'xuất hàng'}</div>
                {loading ? (
                    <div className={cx('loader')}>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                    <Row gutter={[40, 40]}>
                        <Col>
                            <div className={cx('body-title')}>Danh sách nguyên liệu</div>
                            <Table
                                size="small"
                                pagination={{
                                    defaultPageSize: 5,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '30'],
                                }}
                                loading={loading}
                                bordered
                                columns={tableColumns}
                                dataSource={
                                    data &&
                                    data.import_ingredients.map((item) => {
                                        return {
                                            ...item,
                                            price: priceFormat(item.price) + 'đ',
                                            name: item.ingredient.name,
                                            unitName: unitFormatL(item.ingredient.unitName),
                                            id: item.ingredient.id,
                                        };
                                    })
                                }
                            />
                        </Col>
                        <Col>
                            <div className={cx('body-title')}>Thông tin hoá đơn</div>
                            {items.map((item) => (
                                <p style={{ color: '#666', fontSize: 16 }}>
                                    {item.label} :{' '}
                                    <span style={{ color: '#000', fontWeight: 500 }}>{item.children}</span>
                                </p>
                            ))}
                        </Col>
                    </Row>
                )}
            </Modal>
        </>
    );
}

export default DetailChange;
