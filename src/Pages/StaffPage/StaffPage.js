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
import { BsShop } from 'react-icons/bs';
import { RiDeleteBin2Fill, RiEditCircleFill, RiImageAddFill, RiAddCircleFill } from 'react-icons/ri';
import { IoPeopleSharp } from 'react-icons/io5';
import Tippy from '@tippyjs/react';
import Button from '../../components/Button';
import StaffForm from '../../components/StaffForm';
const cx = classNames.bind(styles);

function StaffPage() {
    const [loading, setLoading] = useState();
    const [shopInfo, setShopInfo] = useState();
    const [listStaff, setListStaff] = useState();
    const [active, setActive] = useState();
    const [imageValue, setImageValue] = useState('');
    const [showEditShop, setShowEditShop] = useState();
    const [showStaffForm, setShowStaffForm] = useState();
    const [staffData, setStaffData] = useState();
    const [showConfirmDelStaff, setShowConfirmDelStaff] = useState();
    const localStorageManager = LocalStorageManager.getInstance();
    const userRole = localStorageManager.getItem('userInfo').role;
    const [state, dispatch] = useContext(StoreContext);
    const getShopInfo = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await shopService.getInfoShop(token);
            if (results) {
                setShopInfo(results.shop);
                setActive(results.shop.isActive);
            }
            setLoading(false);
        }
    };

    const editShopInfo = async (isActive = shopInfo.isActive, image = shopInfo.image) => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await shopService.editInfoShop(image, isActive, token);
            if (results && results.isSuccess) {
                setActive(isActive);
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Cập nhật thông tin cửa hàng thành công',
                        title: 'Thành công',
                    }),
                );
            }
        }
    };
    const getListStaff = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await shopService.getListStaff(token);
            if (results && results.isSuccess) {
                setListStaff(results.listStaffs);
            }
            setLoading(false);
        }
    };
    const delStaff = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await shopService.deleteStaff(staffData.phone, token);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: `Xóa thành công nhân viên ${staffData.name} `,
                        title: 'Thành công',
                    }),
                );
            }
        }
        getListStaff();
    };
    useEffect(() => {
        getShopInfo();
        getListStaff();
    }, []);
    const handleCheckBoxActive = (e) => {
        if (e.target.checked) {
            editShopInfo(true);
        } else {
            editShopInfo(false);
        }
    };
    const handleSubmitEdit = () => {
        if (userRole > 1) {
            editShopInfo(active, imageValue);
            setShowEditShop(false);
            setShopInfo({ ...shopInfo, image: imageValue });
        }
    };
    return (
        <div className={cx('wrapper')}>
            {showStaffForm && (
                <StaffForm
                    data={staffData}
                    onCloseModal={(updated) => {
                        if (updated) {
                            getListStaff();
                        }
                        setShowStaffForm(false);
                        setStaffData(false);
                    }}
                />
            )}
            {showConfirmDelStaff && (
                <Modal
                    className={cx('edit-form-wrapper')}
                    onCloseModal={() => {
                        setShowConfirmDelStaff(false);
                        setStaffData(null);
                    }}
                >
                    <div className={cx('form-title')}>
                        Bạn chắc chắn xóa nhân viên {staffData.name}?
                        <div className={cx('form-actions', 'justify-content-center')}>
                            <Button
                                onClick={() => {
                                    setShowConfirmDelStaff(false);
                                    setStaffData(null);
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={() => {
                                    delStaff();
                                    setShowConfirmDelStaff(false);
                                    setStaffData(null);
                                }}
                                className={cx('confirm-btn')}
                                primary
                            >
                                Xóa nhân viên
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            {showEditShop && (
                <Modal className={cx('edit-form-wrapper')} handleClickOutside={() => setShowEditShop(false)}>
                    <div className={cx('form-title')}>Cập nhật thông tin cửa hàng</div>
                    <form onSubmit={handleSubmitEdit}>
                        <Input
                            onChange={(event) => {
                                setImageValue(event.target.value);
                            }}
                            value={imageValue}
                            title="Nhập đường dẫn ảnh"
                        />
                        <Button className={cx('shop-update-btn')} primary type="submit">
                            Cập nhật
                        </Button>
                    </form>
                </Modal>
            )}
            {loading ? (
                <div className={cx('loader')}>
                    <span />
                    <span />
                </div>
            ) : (
                <Row>
                    <Col md={5}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <BsShop className={cx('icon', 'warning')} />
                                    Thông tin cửa hàng
                                </div>
                                <div className={cx('content-subtitle')}></div>
                            </div>
                            <div className={cx('content-body')}>
                                {shopInfo && (
                                    <div className={cx('shop-wrapper')}>
                                        <div className={cx('shop-img-wrapper')}>
                                            <Image src={shopInfo.image} className={cx('shop-img')} />
                                            <RiImageAddFill
                                                onClick={() => setShowEditShop(true)}
                                                className={cx('update-img-btn', { disable: userRole < 2 })}
                                            />
                                        </div>
                                        <div className={cx('shop-address')}>
                                            <span>Địa chỉ :</span> {shopInfo.address}
                                        </div>
                                        <div className={cx('shop-status')}>
                                            <span>Trạng thái :</span>
                                            <Tippy
                                                content={active ? 'Ngưng bán' : 'Mở bán'}
                                                placement="bottom"
                                                duration={0}
                                            >
                                                <Form.Check
                                                    className={cx('shop-active-check')}
                                                    checked={active}
                                                    type="checkbox"
                                                    isValid
                                                    onChange={(e) => handleCheckBoxActive(e)}
                                                    disabled={userRole < 2}
                                                />
                                            </Tippy>
                                            {active ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col md={7}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <IoPeopleSharp className={cx('icon')} />
                                    Danh sách nhân viên của quán
                                </div>
                                <div className={cx('content-subtitle')}>
                                    <div onClick={() => setShowStaffForm(true)} className={cx('icon')}>
                                        <RiAddCircleFill />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('content-body')}>
                                <table className={cx('staff-table')}>
                                    <thead>
                                        <tr>
                                            <th>Họ và tên</th>
                                            <th className={cx('text-center')}>Chức danh</th>
                                            <th className={cx('text-center')}>Số điện thoại</th>
                                            <th className={cx('text-end')}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listStaff &&
                                            listStaff.map((staff, index) => (
                                                <tr key={index} className={cx('staff-wrapper')}>
                                                    <td className={cx('staff-name')}>{staff.name}</td>
                                                    <td>
                                                        <div
                                                            className={cx('staff-role', {
                                                                blue: staff.role === 1,
                                                                yellow: staff.role === 2,
                                                            })}
                                                        >
                                                            {staff.role === 1
                                                                ? 'Nhân viên'
                                                                : staff.role === 2
                                                                ? 'Quản lý'
                                                                : 'Admin'}
                                                        </div>
                                                    </td>
                                                    <td className={cx('text-center')}>{staff.phone}</td>
                                                    <td className={cx('text-end')}>
                                                        <div className={cx('staff-actions')}>
                                                            <Tippy content="Chỉnh sửa" placement="bottom" duration={0}>
                                                                <div
                                                                    onClick={() => {
                                                                        setShowStaffForm(true);
                                                                        setStaffData(staff);
                                                                    }}
                                                                    className={cx('icon')}
                                                                >
                                                                    <RiEditCircleFill />
                                                                </div>
                                                            </Tippy>
                                                            <Tippy content="Xóa" placement="bottom" duration={0}>
                                                                <div
                                                                    onClick={() => {
                                                                        setShowConfirmDelStaff(true);
                                                                        setStaffData(staff);
                                                                    }}
                                                                    className={cx('icon', 'red')}
                                                                >
                                                                    <RiDeleteBin2Fill />
                                                                </div>
                                                            </Tippy>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default StaffPage;
