import styles from './ShopPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { StoreContext, actions } from '../../store';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as adminService from '../../services/adminService';
import * as mapService from '../../services/mapService';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import Button from '../../components/Button';
import ManagerForm from '../../components/ManagerForm';
import { onlyNumber } from '../../utils/format';
import { useDebounce } from '../../hooks';
import { IoLocationSharp } from 'react-icons/io5';
const cx = classNames.bind(styles);

function ShopForm({ data, onCloseModal = () => {} }) {
    const [addressValue, setAddressValue] = useState(data ? data.address : '');
    const [searchResult, setSearchResult] = useState([]);
    const [showAddressResult, setShowAddressResult] = useState(false);

    const [latitudeValue, setLatitudeValue] = useState(data ? data.latitude : '');
    const [longitudeValue, setLongitudeValue] = useState(data ? data.longitude : '');
    const [imageValue, setImageValue] = useState(data ? data.image : '');
    const [isActive, setIsActive] = useState(data ? data.isActive : 1);
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const debouncedValue = useDebounce(addressValue, 500);
    const userRole = localStorageManage.getItem('userInfo').role;
    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            const results = await mapService.searchAddress(debouncedValue);
            setSearchResult(results);
        };
        fetchApi();
    }, [debouncedValue]);
    const handleClickAddress = (latitude, longitude, newAddress) => {
        setLatitudeValue(latitude);
        setLongitudeValue(longitude);
        setAddressValue(newAddress);
        setShowAddressResult(false);
    };
    const editShop = async (activeValue) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.editShop(
                data.idShop,
                token,
                addressValue,
                latitudeValue,
                longitudeValue,
                imageValue,
                isActive,
            );
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Cập nhật thông tin cửa hàng thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            }
        }
    };
    const addNewShop = async (activeValue) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.addShop(
                token,
                addressValue,
                latitudeValue,
                longitudeValue,
                imageValue,
                isActive,
            );
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Tạo mới cửa hàng thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            } else {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Cửa hàng đã tồn tại',
                        title: 'Thất bại',
                        type: 'error',
                    }),
                );
            }
        }
    };
    const handleCancelEdit = () => {
        if (data) {
            setAddressValue(data.address);
            setLatitudeValue(data.latitude);
            setLongitudeValue(data.longitude);
            setImageValue(data.image);
        } else {
            setAddressValue('');
            setLatitudeValue('');
            setLongitudeValue('');
            setImageValue('');
        }
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        if (data) {
            editShop();
        } else {
            addNewShop();
        }
    };

    useEffect(() => {
        if (data) {
            if (
                data.address !== addressValue ||
                data.latitude !== Number(latitudeValue) ||
                data.longitude !== Number(longitudeValue) ||
                data.image !== imageValue ||
                data.isActive !== isActive
            ) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        } else {
            if (
                addressValue !== '' ||
                Number(latitudeValue) !== '' ||
                Number(longitudeValue) !== '' ||
                imageValue !== '' ||
                isActive !== true
            ) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        }
    }, [addressValue, latitudeValue, longitudeValue, imageValue, isActive]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('edit-form-wrapper')}
        >
            <div className={cx('form-title')}>{data ? 'Cập nhật thông tin cửa hàng' : 'Tạo mới cửa hàng'}</div>

            <div className={cx('form-body')}>
                <form onSubmit={handleClickConfirm} className={cx('form-info')}>
                    <HeadlessTippy
                        interactive
                        visible={showAddressResult}
                        onClickOutside={() => setShowAddressResult(false)}
                        placement="bottom-start"
                        offset={[0, 0]}
                        render={(attrs) => (
                            <div className={cx('search-result')}>
                                {searchResult.map((item, index) => (
                                    <div
                                        onClick={() => handleClickAddress(item.lat, item.lon, item.display_name)}
                                        key={index}
                                        className={cx('search-item')}
                                    >
                                        <IoLocationSharp className={cx('location-icon')} />
                                        <div>
                                            <div className={cx('address-title')}>
                                                {item.address.house_number} {item.address.road}
                                            </div>
                                            <div className={cx('address-detail')}>{item.display_name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    >
                        <div>
                            <Input
                                onFocus={() => setShowAddressResult(true)}
                                onChange={(event) => {
                                    setAddressValue(event.target.value);
                                    setValueChange(true);
                                }}
                                value={addressValue}
                                title="Địa chỉ quán"
                                type="text"
                            />
                        </div>
                    </HeadlessTippy>

                    <div className={cx('d-flex', 'justify-content-between')}>
                        <Input
                            className={cx('half-width')}
                            onChange={(event) => {
                                if (onlyNumber(event.target.value)) {
                                    setLatitudeValue(event.target.value);
                                }
                            }}
                            value={latitudeValue}
                            title="Vĩ độ"
                            type="text"
                        />
                        <Input
                            required={!!!data}
                            className={cx('half-width')}
                            onChange={(event) => {
                                setLongitudeValue(event.target.value);
                            }}
                            value={longitudeValue}
                            title="kinh độ"
                            type="text"
                        />
                    </div>
                    <div className={cx('d-flex', 'justify-content-between', 'align-items-end')}>
                        <Input
                            className={cx('image-input')}
                            onChange={(event) => {
                                setImageValue(event.target.value);
                            }}
                            value={imageValue}
                            title="Hình ảnh cửa hàng"
                            type="text"
                        />
                        <select
                            className={cx('status-select')}
                            value={isActive}
                            onChange={(event) => {
                                setIsActive(event.target.value);
                            }}
                        >
                            <option value={0}>Ngưng hoạt động</option>
                            <option value={1}>Hoạt động</option>
                        </select>
                    </div>

                    <div className={cx('form-actions')}>
                        {valueChange && (
                            <Button divBtn onClick={handleCancelEdit}>
                                Đặt lại
                            </Button>
                        )}
                        <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                            {data ? 'Cập nhật' : 'Tạo'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default ShopForm;
