import styles from './StaffForm.module.scss';
import classNames from 'classnames/bind';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as shopService from '../../services/shopService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';

const cx = classNames.bind(styles);

function StaffForm({ data, onCloseModal = () => {} }) {
    const [nameValue, setNameValue] = useState(data ? data.name : '');
    const [phone, setPhoneValue] = useState(data ? data.phone : '');
    const [mail, setMailValue] = useState(data ? data.mail : '');
    const [passwordValue, setPasswordValue] = useState('');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const editStaff = async (activeValue) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await shopService.editStaff(data.idUser, token, phone, mail, nameValue, passwordValue);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Cập nhật thông tin nhân viên thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            } else {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: results.message,
                        title: 'Thất bại',
                        type: 'error',
                    }),
                );
            }
        }
    };
    const addNewStaff = async (activeValue) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await shopService.addStaff(phone, mail, nameValue, passwordValue, token);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Đăng kí tài khoản nhân viên thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            } else {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: results.message,
                        title: 'Thất bại',
                        type: 'error',
                    }),
                );
            }
        }
    };
    const handleCancelEdit = () => {
        if (data) {
            setNameValue(data.name);
            setPhoneValue(data.phone);
            setMailValue(data.mail);
        } else {
            setNameValue('');
            setPhoneValue('');
            setMailValue('');
        }
        setPasswordValue('');
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        if (data) {
            editStaff();
        } else {
            addNewStaff();
        }
    };

    useEffect(() => {
        if (data) {
            if (data.name !== nameValue || data.phone !== phone || data.mail !== mail || passwordValue !== '') {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        }
    }, [nameValue, phone, passwordValue, mail]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('edit-form-wrapper')}
        >
            <div className={cx('form-title')}>
                {data ? 'Cập nhật thông tin nhân viên' : 'Đăng kí tài khoản nhân viên'}
            </div>

            <div className={cx('form-body')}>
                <form onSubmit={handleClickConfirm} className={cx('form-info')}>
                    <Input
                        onChange={(event) => {
                            setNameValue(event.target.value);
                            setValueChange(true);
                        }}
                        value={nameValue}
                        title="Tên nhân viên"
                        type="text"
                    />

                    <Input
                        className={cx('price-input')}
                        onChange={(event) => {
                            setMailValue(event.target.value);
                            setValueChange(true);
                        }}
                        value={mail}
                        title="Tài khoản gmail"
                        type="email"
                    />
                    <div className={cx('item-price-wrapper')}>
                        <Input
                            className={cx('price-input')}
                            onChange={(event) => {
                                if (onlyNumber(event.target.value)) {
                                    setPhoneValue(event.target.value);
                                    setValueChange(true);
                                }
                            }}
                            value={phone}
                            title="Số điện thoại"
                            type="text"
                        />
                        <Input
                            required={!!!data}
                            className={cx('price-input')}
                            onChange={(event) => {
                                setPasswordValue(event.target.value);
                                setValueChange(true);
                            }}
                            value={passwordValue}
                            title="Mật khẩu mới"
                            type="text"
                        />
                    </div>

                    <div className={cx('form-actions')}>
                        {valueChange && <Button onClick={handleCancelEdit}>Đặt lại</Button>}
                        <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                            {data ? 'Cập nhật' : 'Tạo tài khoản'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default StaffForm;
