import styles from './ManagerForm.module.scss';
import classNames from 'classnames/bind';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';

const cx = classNames.bind(styles);

function ManagerForm({ data, onCloseModal = () => {}, listShop }) {
    const [nameValue, setNameValue] = useState(data ? data.name : '');
    const [phoneValue, setPhoneValue] = useState(data ? data.phone : '');
    const [passwordValue, setPasswordValue] = useState('');
    const [idShop, setIdShop] = useState(data ? data.idShop : '');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const editManager = async (activeValue) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.editManager(
                data.idStaff,
                idShop,
                token,
                phoneValue,
                passwordValue,
                nameValue,
            );
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Cập nhật thông tin nhân viên thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            }
        }
    };
    const addNewManager = async (activeValue) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.addManager(idShop, phoneValue, passwordValue, nameValue, token);
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
                        content: 'Số điện thoại đã được đăng kí',
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
        } else {
            setNameValue('');
            setPhoneValue('');
        }
        setPasswordValue('');
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        if (data) {
            editManager();
        } else {
            addNewManager();
        }
    };

    useEffect(() => {
        if (data) {
            if (data.name !== nameValue || data.phone !== phoneValue || passwordValue !== '') {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        } else {
            if (nameValue !== '' || phoneValue !== '' || passwordValue !== '') {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        }
    }, [nameValue, phoneValue, passwordValue]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('edit-form-wrapper')}
        >
            <div className={cx('form-title')}>{data ? 'Cập nhật thông tin quản lý' : 'Đăng kí tài khoản quản lý'}</div>

            <div className={cx('form-body')}>
                <form onSubmit={handleClickConfirm} className={cx('form-info')}>
                    <div className={cx('d-flex', 'justify-content-between', 'align-items-end')}>
                        <Input
                            className={cx('name-input')}
                            onChange={(event) => {
                                setNameValue(event.target.value);
                            }}
                            value={nameValue}
                            title="Tên quản lý"
                            type="text"
                        />
                        <select
                            className={cx('workplace-select')}
                            value={idShop}
                            onChange={(event) => {
                                setIdShop(event.target.value);
                            }}
                        >
                            <option>Cơ sở quản lý</option>
                            {listShop.map((shop) => (
                                <option key={shop.idShop} value={shop.idShop}>
                                    Cơ sở {shop.idShop}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('d-flex', 'justify-content-between')}>
                        <Input
                            className={cx('half-width')}
                            onChange={(event) => {
                                if (onlyNumber(event.target.value)) {
                                    setPhoneValue(event.target.value);
                                }
                            }}
                            value={phoneValue}
                            title="Số điện thoại"
                            type="text"
                        />
                        <Input
                            required={!!!data}
                            className={cx('half-width')}
                            onChange={(event) => {
                                setPasswordValue(event.target.value);
                            }}
                            value={passwordValue}
                            title="Mật khẩu mới"
                            type="text"
                        />
                    </div>

                    <div className={cx('form-actions')}>
                        {valueChange && (
                            <Button divBtn onClick={handleCancelEdit}>
                                Đặt lại
                            </Button>
                        )}
                        <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                            {data ? 'Cập nhật' : 'Tạo tài khoản'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default ManagerForm;
