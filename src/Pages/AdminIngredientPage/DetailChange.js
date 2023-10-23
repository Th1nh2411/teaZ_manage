import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
// import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import * as ingredientService from '../../services/ingredientService';
import { Badge, Descriptions } from 'antd';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function DetailChange({ id, onCloseModal = () => {}, type = 'import' }) {
    const [data, setData] = useState(null);
    const getDetailChange = async () => {
        const results =
            type === 'import'
                ? await ingredientService.getDetailImport(id)
                : await ingredientService.getDetailExport(id);
        if (results) {
            setData(results);
        }
    };
    console.log(data && data.isCompleted);
    console.log(data);
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
            children: (
                <Badge
                // text={
                //     data && data.isCompleted === 1
                //         ? 'Đã hoàn thành'
                //         : data.isCompleted === 0
                //         ? 'Chưa hoàn thành'
                //         : 'Đã huỷ'
                // }
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
    return (
        <>
            <Modal
                handleClickOutside={() => {
                    onCloseModal();
                }}
                className={cx('form-wrapper')}
            >
                <div className={cx('form-title')}>Chi tiết {type === 'import' ? 'nhập hàng' : 'xuất hàng'}</div>

                <div className={cx('form-body')}>
                    <Descriptions title="User Info" items={items} />
                </div>
            </Modal>
        </>
    );
}

export default DetailChange;
