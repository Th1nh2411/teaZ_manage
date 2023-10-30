import styles from './StaffPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import dayjs from 'dayjs';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { StoreContext, actions } from '../../store';
import * as shopService from '../../services/shopService';
import { BsShop } from 'react-icons/bs';
import { RiDeleteBin2Fill, RiEditCircleFill, RiImageAddFill, RiAddCircleFill } from 'react-icons/ri';
import { IoPeopleSharp } from 'react-icons/io5';
import Tippy from '@tippyjs/react';
import Button from '../../components/Button';
import StaffForm from '../../components/StaffForm';
import ShopForm from './ShopForm';
import ExportFile from '../../components/ExportFile/ExportFile';
import { Popconfirm, Switch } from 'antd';
const cx = classNames.bind(styles);

function StaffPage() {
    const [loading, setLoading] = useState();
    const [shopInfo, setShopInfo] = useState();
    const [listStaff, setListStaff] = useState();
    const [active, setActive] = useState();
    const [showStaffForm, setShowStaffForm] = useState();
    const [staffData, setStaffData] = useState();
    const [showShopForm, setShowShopForm] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const userRole = state.userInfo && state.userInfo.role;
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
        let results;
        if (shopInfo.isActive) {
            results = await shopService.editInfoShop({ isActive: 0 });
        } else {
            results = await shopService.editInfoShop({ isActive: 1 });
        }
        if (results) {
            getShopInfo();
            getListStaff();
            setActive(isActive);
            state.showToast(results.message);
        }
    };
    const getListStaff = async () => {
        setLoading(true);
        const results = await shopService.getListStaff();
        if (results) {
            setListStaff(results.data.filter((item) => item.isActive));
        }
        setLoading(false);
    };
    const delStaff = async (id) => {
        const results = await shopService.deleteStaff(id);
        if (results) {
            state.showToast(results.message);
        }
        getListStaff();
    };
    useEffect(() => {
        getShopInfo();
        getListStaff();
    }, []);
    const handleCheckBoxActive = (e) => {
        if (e.target.checked) {
            editShopInfo(0);
        } else {
            editShopInfo(1);
        }
    };
    console.log(listStaff);
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

                                            <Popconfirm
                                                title={active ? 'Ngưng bán' : 'Mở bán'}
                                                description={
                                                    active ? 'Ngưng kinh doanh cửa hàng?' : 'Mở kinh doanh cửa hàng?'
                                                }
                                                onConfirm={handleCheckBoxActive}
                                                okText={'Xác nhận'}
                                                cancelText="Huỷ"
                                            >
                                                <Switch
                                                    className={cx('shop-active-check')}
                                                    checked={active}
                                                    disabled={userRole < 2}
                                                    style={{}}
                                                />
                                            </Popconfirm>
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
                                                            })}
                                                        >
                                                            {staff.role === 1 ? 'Nhân viên' : 'Quản lý'}
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
                                                            {staff.role === 1 && (
                                                                <Popconfirm
                                                                    title={'Xoá tài khoản'}
                                                                    description={'Xoá tài khoản nhân viên này?'}
                                                                    onConfirm={() => delStaff(staff.id)}
                                                                    okText={'Xác nhận'}
                                                                    cancelText="Huỷ"
                                                                >
                                                                    <div className={cx('icon', 'red')}>
                                                                        <RiDeleteBin2Fill />
                                                                    </div>
                                                                </Popconfirm>
                                                            )}
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
