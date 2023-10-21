import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
// import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import { StoreContext, actions } from '../../store';
import { BiImport, BiExport, BiUpload } from 'react-icons/bi';
import LocalStorageManager from '../../utils/LocalStorageManager';
import Input from '../../components/Input/Input';
import { onlyNumber } from '../../utils/format';
import { Upload, Button, message, Select } from 'antd';
import axios from 'axios';
const cx = classNames.bind(styles);

function IngredientForm({ data, onCloseModal = () => {} }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [nameValue, setNameValue] = useState(data ? data.name : '');
    const [imageValue, setImageValue] = useState(null);
    const [unitValue, setUnitValue] = useState(data ? data.unitName : 'g');
    const [isActive, setIsActive] = useState(data ? data.isActive : 0);
    const [valueChange, setValueChange] = useState(false);
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const editIngredient = async () => {
        setLoading(true);
        const res = await adminService.uploadFile(imageValue);
        const results = await adminService.editIngredient(data.id, {
            name: nameValue,
            image: res.url,
            unitName: unitValue,
        });
        setLoading(false);
        if (results) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thành công',
                }),
            );
            onCloseModal(true);
        }
    };

    const addNewIngredient = async () => {
        if (!nameValue || !imageValue || !unitValue) {
            messageApi.open({
                type: 'error',
                content: 'This is an error message',
            });
        }
        setLoading(true);
        const res = await adminService.uploadFile(imageValue);
        const results = await adminService.addIngredient({ name: nameValue, unitName: unitValue, image: res.url });
        setLoading(false);
        if (results) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
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
    };
    const handleCancelEdit = () => {
        setImageValue(null);
        if (data) {
            setNameValue(data.name);
            setUnitValue(data.unitName);
            setIsActive(data.isActive);
        } else {
            setNameValue('');
            setUnitValue('');
            setIsActive(0);
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
                imageValue !== null ||
                data.unitName !== unitValue ||
                Number(data.isActive) !== Number(isActive)
            ) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        } else {
            if (nameValue !== '' || imageValue !== null || unitValue !== 'g' || Number(isActive) !== 1) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        }
    }, [nameValue, imageValue, unitValue, isActive]);

    return (
        <>
            {contextHolder}
            <Modal
                handleClickOutside={() => {
                    onCloseModal();
                }}
                className={cx('form-wrapper')}
            >
                <div className={cx('form-title')}>
                    {data ? 'Cập nhật thông tin nguyên liệu' : 'Thêm mới nguyên liệu'}
                </div>

                <div className={cx('form-body')}>
                    <form onSubmit={handleClickConfirm} className={cx('form-info')}>
                        {/* <div className={cx('d-flex', 'justify-content-between', 'align-items-end')}> */}
                        <Input
                            className={cx('flex-grow-1')}
                            onChange={(event) => {
                                setNameValue(event.target.value);
                            }}
                            value={nameValue}
                            title="Tên nguyên liệu"
                            type="text"
                        />

                        {/* </div> */}

                        {/* <div className={cx('d-flex', 'align-items-start', 'justify-content-between', 'mt-8')}> */}
                        <div className={cx('d-flex', 'align-items-center', 'mt-8')}>
                            <h4>Đơn vị tính : </h4>
                            <Select
                                className={cx('ml-16')}
                                dropdownStyle={{ zIndex: 1000000 }}
                                value={unitValue}
                                onChange={(value) => {
                                    setUnitValue(value);
                                }}
                                options={[
                                    {
                                        value: 'g',
                                        label: 'Gram',
                                    },
                                    {
                                        value: 'kg',
                                        label: 'Kilogram',
                                    },
                                    {
                                        value: 'ml',
                                        label: 'Mililit',
                                    },
                                    {
                                        value: 'pcs',
                                        label: 'pcs',
                                    },
                                ]}
                            />
                        </div>
                        <div className={cx('d-flex', 'mt-16')}>
                            <h4>Ảnh hiển thị : </h4>
                            <Upload
                                className={cx('ml-16')}
                                fileList={imageValue && [imageValue]}
                                accept="image/*"
                                beforeUpload={() => false}
                                onChange={(info) => {
                                    const { file, fileList } = info;
                                    if (fileList[0]) {
                                        setImageValue(fileList[0].originFileObj);
                                    } else {
                                        setImageValue(null);
                                    }
                                }}
                                maxCount={1}
                            >
                                <Button onClick={(e) => e.preventDefault()} icon={<BiUpload />}>
                                    Upload ảnh
                                </Button>
                            </Upload>
                        </div>
                        {/* </div> */}

                        <div className={cx('form-actions')}>
                            {valueChange && (
                                <Button size="large" onClick={handleCancelEdit}>
                                    Đặt lại
                                </Button>
                            )}
                            <Button
                                onClick={handleClickConfirm}
                                loading={loading}
                                type="primary"
                                size="large"
                                className={cx('confirm-btn')}
                                primary
                                disabled={!valueChange}
                            >
                                {data ? 'Cập nhật' : 'Thêm nguyên liệu'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default IngredientForm;
