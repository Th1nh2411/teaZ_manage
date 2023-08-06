import styles from './StaffPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { StoreContext, actions } from '../../store';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as shopService from '../../services/shopService';
import * as mapService from '../../services/mapService';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import Button from '../../components/Button';
import { onlyNumber } from '../../utils/format';
import { useDebounce } from '../../hooks';
import { IoLocationSharp } from 'react-icons/io5';
const cx = classNames.bind(styles);

function ShopForm({ data, onCloseModal = () => {} }) {
    const [address, setAddressValue] = useState(data ? data.address : '');
    const [searchResult, setSearchResult] = useState([]);
    const [showAddressResult, setShowAddressResult] = useState(false);

    const [latitude, setLatitudeValue] = useState(data ? data.latitude : '');
    const [longitude, setLongitudeValue] = useState(data ? data.longitude : '');
    const [image, setImageValue] = useState(data ? data.image : '');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const debouncedValue = useDebounce(address, 500);
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
    const editShop = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await shopService.editInfoShop({ address, latitude, longitude, image }, token);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Cập nhật thông tin cửa hàng thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            } else {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: results.message || 'Cập nhật thất bại',
                        title: 'Thất bại',
                        type: 'error',
                    }),
                );
            }
        }
    };

    const handleCancelEdit = () => {
        setAddressValue(data.address);
        setLatitudeValue(data.latitude);
        setLongitudeValue(data.longitude);
        setImageValue(data.image);
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        editShop();
    };

    useEffect(() => {
        if (
            data.address !== address ||
            data.latitude !== Number(latitude) ||
            data.longitude !== Number(longitude) ||
            data.image !== image
        ) {
            setValueChange(true);
        } else {
            setValueChange(false);
        }
    }, [address, latitude, longitude, image]);
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
                                value={address}
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
                            value={latitude}
                            title="Vĩ độ"
                            type="text"
                        />
                        <Input
                            required={!!!data}
                            className={cx('half-width')}
                            onChange={(event) => {
                                setLongitudeValue(event.target.value);
                            }}
                            value={longitude}
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
                            value={image}
                            title="Hình ảnh cửa hàng"
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
                            {data ? 'Cập nhật' : 'Tạo'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default ShopForm;
