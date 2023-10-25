import styles from './StaffForm.module.scss';
import classNames from 'classnames/bind';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as shopService from '../../services/shopService';
import * as authService from '../../services/authService';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import Cookies from 'js-cookie';

const cx = classNames.bind(styles);

function StaffForm({ data, onCloseModal = () => {} }) {
    const [name, setNameValue] = useState(data ? data.name : '');
    const [phone, setPhoneValue] = useState(data ? data.phone : '');
    const [password, setPasswordValue] = useState('');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const userRole = state.userInfo && state.userInfo.role;
    const editStaff = async () => {
        const results = await shopService.editStaff(data.id, { phone, name, password });
        if (results) {
            if (data.role === 2) {
                const results2 = await authService.refreshToken(phone);
                if (results2) {
                    Cookies.set('userInfo', JSON.stringify(results.userInfo));
                    dispatch(actions.setUserInfo(results2.userInfo));
                }
            }
            state.showToast(results.message);

            onCloseModal(true);
        }
    };
    const addNewStaff = async () => {
        console.log(phone, name, password);
        const results = await shopService.addStaff({ phone, name, password });
        if (results) {
            state.showToast(results.message);

            onCloseModal(true);
        }
    };
    const handleCancelEdit = () => {
        if (data) {
            setNameValue(data.name);
            setPhoneValue(data.phone);
        } else {
            setNameValue('');
            setPhoneValue('');
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
            if (data.name !== name || data.phone !== phone || password !== '') {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        }
    }, [name, phone, password]);
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
                        value={name}
                        title="Tên nhân viên"
                        type="text"
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
                            value={password}
                            title="Mật khẩu"
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
