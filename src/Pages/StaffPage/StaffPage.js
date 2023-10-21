import styles from './StaffPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import dayjs from 'dayjs';
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
import ShopForm from './ShopForm';
import ExportFile from '../../components/ExportFile/ExportFile';
const cx = classNames.bind(styles);

function StaffPage() {
    const [loading, setLoading] = useState();
    const [shopInfo, setShopInfo] = useState();
    const [listStaff, setListStaff] = useState();
    const [active, setActive] = useState();
    const [showStaffForm, setShowStaffForm] = useState();
    const [staffData, setStaffData] = useState();
    const [showConfirmDelStaff, setShowConfirmDelStaff] = useState();
    const [showShopForm, setShowShopForm] = useState();
    const localStorageManager = LocalStorageManager.getInstance();
    const userRole = localStorageManager.getItem('userInfo').role;
    const [state, dispatch] = useContext(StoreContext);
    const getShopInfo = async () => {
        setLoading(true);
        const results = await shopService.getInfoShop();
        if (results) {
            setShopInfo(results.data);
            setActive(results.data.isActive);
        }
        setLoading(false);
    };

    const editShopInfo = async (isActive = shopInfo.isActive) => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await shopService.editInfoShop({ isActive }, token);
            if (results) {
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
        setLoading(true);
        const results = await shopService.getListStaff();
        if (results) {
            setListStaff(results.data);
        }
        setLoading(false);
    };
    const delStaff = async () => {
        const results = await shopService.deleteStaff(staffData.id);
        if (results) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thành công',
                }),
            );
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
            {showShopForm && (
                <ShopForm
                    data={shopInfo}
                    onCloseModal={(updated) => {
                        if (updated) {
                            getShopInfo();
                        }
                        setShowShopForm(false);
                    }}
                />
            )}
            {loading ? (
                <div className={cx('loader')}>
                    <span />
                    <span />
                </div>
            ) : (
                <Row>
                    <Col lg={5}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <BsShop className={cx('icon', 'warning')} />
                                    Thông tin cửa hàng
                                </div>
                                <div className={cx('content-subtitle')}>
                                    <div onClick={() => setShowShopForm(true)} className={cx('icon')}>
                                        <RiEditCircleFill />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('content-body')}>
                                {shopInfo && (
                                    <div className={cx('shop-wrapper')}>
                                        <div className={cx('shop-img-wrapper')}>
                                            <Image src={shopInfo.image} className={cx('shop-img')} />
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
                    <Col lg={7}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <IoPeopleSharp className={cx('icon')} />
                                    Danh sách nhân viên
                                </div>
                                <div className={cx('content-subtitle', 'd-flex')}>
                                    <ExportFile
                                        csvData={
                                            listStaff &&
                                            listStaff.map((item) => {
                                                return {
                                                    id: item.idUser,
                                                    Tên: item.name,
                                                    Mail: item.mail,
                                                    SĐT: item.phone,
                                                };
                                            })
                                        }
                                        fileName="ListStaff"
                                    />
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
                                            <th className={cx('text-center', 'hidden-mb')}>Giới tính</th>
                                            <th className={cx('text-center', 'hidden-mb')}>Ngày sinh</th>
                                            <th className={cx('text-center', 'hidden-mb')}>Ngày vào làm</th>
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
                                                                blue: staff.role === 2,
                                                                yellow: staff.role === 1,
                                                            })}
                                                        >
                                                            {staff.role == 1
                                                                ? 'Nhân viên'
                                                                : staff.role == 2
                                                                ? 'Admin'
                                                                : 'Quản lý'}
                                                        </div>
                                                    </td>
                                                    <td className={cx('text-center')}>{staff.phone}</td>
                                                    <td className={cx('text-center', 'hidden-mb')}>{staff.gender}</td>
                                                    <td className={cx('text-center')}>
                                                        {dayjs(staff.birthday).format('YYYY-MM-DD')}
                                                    </td>
                                                    <td className={cx('text-center')}>
                                                        {dayjs(staff.hiredate).format('YYYY-MM-DD')}
                                                    </td>
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
                                                            {
                                                                (staff.role = 2 && (
                                                                    <Tippy
                                                                        content="Xóa"
                                                                        placement="bottom"
                                                                        duration={0}
                                                                    >
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
                                                                ))
                                                            }
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
