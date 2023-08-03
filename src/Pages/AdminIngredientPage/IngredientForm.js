import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import { StoreContext, actions } from '../../store';
import { BiImport, BiExport } from 'react-icons/bi';
import LocalStorageManager from '../../utils/LocalStorageManager';
import Input from '../../components/Input/Input';
import { onlyNumber } from '../../utils/format';
const cx = classNames.bind(styles);

function IngredientForm({ data, onCloseModal = () => {} }) {
    const [nameValue, setNameValue] = useState(data ? data.name : '');
    const [imageValue, setImageValue] = useState(data ? data.image : '');
    const [unitValue, setUnitValue] = useState(data ? data.unitName : 'g');
    const [isDel, setIsDel] = useState(data ? data.isDel : 0);
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const editIngredient = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.editIngredient(
                data.idIngredient,
                token,
                nameValue,
                imageValue,
                unitValue,
                isDel,
            );
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Cập nhật thông tin nguyên liệu thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            }
        }
    };
    const addNewIngredient = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.addIngredient(nameValue, imageValue, unitValue, token);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Thêm mới nguyên liệu thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            } else {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Thêm mới nguyên liệu thất bại',
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
            setImageValue(data.image);
            setUnitValue(data.unitName);
            setIsDel(data.isDel);
        } else {
            setNameValue('');
            setImageValue('');
            setUnitValue('');
            setIsDel(0);
        }
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        if (data) {
            editIngredient();
        } else {
            addNewIngredient();
        }
    };

    useEffect(() => {
        if (data) {
            if (
                data.name !== nameValue ||
                data.image !== imageValue ||
                data.unitName !== unitValue ||
                data.isDel !== Number(isDel)
            ) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        } else {
            if (nameValue !== '' || imageValue !== '' || unitValue !== 'g' || Number(isDel) !== 0) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        }
    }, [nameValue, imageValue, unitValue, isDel]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('form-wrapper')}
        >
            <div className={cx('form-title')}>{data ? 'Cập nhật thông tin nguyên liệu' : 'Thêm mới nguyên liệu'}</div>

            <div className={cx('form-body')}>
                <form onSubmit={handleClickConfirm} className={cx('form-info')}>
                    <div className={cx('d-flex', 'justify-content-between', 'align-items-end')}>
                        <Input
                            className={cx('flex-grow-1')}
                            onChange={(event) => {
                                setNameValue(event.target.value);
                            }}
                            value={nameValue}
                            title="Tên nguyên liệu"
                            type="text"
                        />
                        <select
                            className={cx('custom-select')}
                            value={unitValue}
                            onChange={(event) => {
                                setUnitValue(event.target.value);
                            }}
                        >
                            <option value={'g'}>gram</option>
                            <option value={'ml'}>mililit</option>
                            <option value={'units'}>unit</option>
                        </select>
                        <select
                            disabled={!data}
                            className={cx('custom-select')}
                            value={isDel}
                            onChange={(event) => {
                                setIsDel(event.target.value);
                            }}
                        >
                            <option value={0}>active</option>
                            <option value={1}>inactive</option>
                        </select>
                    </div>
                    <Input
                        onChange={(event) => {
                            setImageValue(event.target.value);
                        }}
                        value={imageValue}
                        title="Hình ảnh nguyên liệu"
                        type="text"
                    />

                    <div className={cx('form-actions')}>
                        {valueChange && (
                            <Button divBtn onClick={handleCancelEdit}>
                                Đặt lại
                            </Button>
                        )}
                        <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                            {data ? 'Cập nhật' : 'Thêm nguyên liệu'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default IngredientForm;
