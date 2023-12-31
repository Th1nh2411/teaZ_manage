import styles from './StaffPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { StoreContext, actions } from '../../store';
import * as shopService from '../../services/shopService';
import * as mapService from '../../services/mapService';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
// import Button from '../../components/Button';
import { onlyNumber } from '../../utils/format';
import { useDebounce } from '../../hooks';
import { IoLocationSharp } from 'react-icons/io5';
import { Upload, Button, message } from 'antd';
import { BiUpload } from 'react-icons/bi';
const cx = classNames.bind(styles);

function ShopForm({ data, onCloseModal = () => {} }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [address, setAddressValue] = useState(data ? data.address : '');
    const [searchResult, setSearchResult] = useState([]);
    const [showAddressResult, setShowAddressResult] = useState(false);

    const [latitude, setLatitudeValue] = useState(data ? data.latitude : '');
    const [longitude, setLongitudeValue] = useState(data ? data.longitude : '');
    const [image, setImageValue] = useState(null);
    const [valueChange, setValueChange] = useState(false);
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const debouncedValue = useDebounce(address, 500);
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
        if (!address || !latitude || !longitude) {
            messageApi.open({
                type: 'error',
                content: 'Vui lòng nhập đầy đủ thông tin',
                style: {
                    zIndex: '100000000',
                },
            });
            return;
        }

        setLoading(true);
        const res = image && (await adminService.uploadFile(image));
        const results = await shopService.editInfoShop({ address, latitude, longitude, image: res && res.url });
        setLoading(false);
        if (results) {
            state.showToast(results.message);

            onCloseModal(true);
        }
    };

    const handleCancelEdit = () => {
        setAddressValue(data.address);
        setLatitudeValue(data.latitude);
        setLongitudeValue(data.longitude);
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        editShop();
    };

    useEffect(() => {
        if (
            data.address !== address ||
            image !== null ||
            data.latitude !== Number(latitude) ||
            data.longitude !== Number(longitude)
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
            {contextHolder}
            <div className={cx('form-title')}>{data ? 'Cập nhật thông tin cửa hàng' : 'Tạo mới cửa hàng'}</div>

            <div className={cx('form-body')}>
                <div className={cx('form-info')}>
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
                        <Upload
                            fileList={image && [image]}
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
                            <Button
                                className={cx('custom-upload')}
                                onClick={(e) => e.preventDefault()}
                                icon={<BiUpload />}
                            >
                                Upload ảnh
                            </Button>
                        </Upload>
                    </div>

                    <div className={cx('form-actions')}>
                        {valueChange && <Button onClick={handleCancelEdit}>Đặt lại</Button>}
                        <Button
                            onClick={handleClickConfirm}
                            className={cx('confirm-btn')}
                            type="primary"
                            loading={loading}
                            disabled={!valueChange}
                        >
                            {data ? 'Cập nhật' : 'Tạo'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ShopForm;
