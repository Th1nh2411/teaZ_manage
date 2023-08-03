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
import { BsShop } from 'react-icons/bs';
import { RiDeleteBin2Fill, RiEditCircleFill, RiImageAddFill, RiAddCircleFill } from 'react-icons/ri';
import { IoPeopleSharp } from 'react-icons/io5';
import Tippy from '@tippyjs/react';
import Button from '../../components/Button';
import ManagerForm from '../../components/ManagerForm';
import ShopForm from './ShopForm';
const cx = classNames.bind(styles);

function ShopPage() {
    const [loading, setLoading] = useState();
    const [listShop, setListShop] = useState();
    const [listManager, setListManager] = useState();
    const [showShopForm, setShowShopForm] = useState();
    const [showStaffForm, setShowStaffForm] = useState();
    const [managerData, setManagerData] = useState();
    const [shopData, setShopData] = useState();
    const [showConfirmDelStaff, setShowConfirmDelStaff] = useState();
    const localStorageManager = LocalStorageManager.getInstance();
    const userRole = localStorageManager.getItem('userInfo').role;
    const [state, dispatch] = useContext(StoreContext);
    const getListShop = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await adminService.getListShop(token);
            if (results) {
                setListShop(results.listShops);
            }
            setLoading(false);
        }
    };

    const getListManager = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await adminService.getListManager(token);
            if (results && results.isSuccess) {
                setListManager(results.listStaffs);
            }
            setLoading(false);
        }
    };
    const delStaff = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await adminService.deleteManager(managerData.phone, token);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: `Xóa thành công nhân viên ${managerData.name} `,
                        title: 'Thành công',
                    }),
                );
            }
        }
        getListManager();
    };
    useEffect(() => {
        getListShop();
        getListManager();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {showStaffForm && (
                <ManagerForm
                    listShop={listShop}
                    data={managerData}
                    onCloseModal={(updated) => {
                        if (updated) {
                            getListManager();
                        }
                        setShowStaffForm(false);
                        setManagerData(false);
                    }}
                />
            )}
            {showConfirmDelStaff && (
                <Modal
                    className={cx('edit-form-wrapper')}
                    onCloseModal={() => {
                        setShowConfirmDelStaff(false);
                        setManagerData(null);
                    }}
                >
                    <div className={cx('form-title')}>
                        Bạn chắc chắn xóa nhân viên {managerData.name}?
                        <div className={cx('d-flex', 'mt-4', 'justify-content-center')}>
                            <Button
                                onClick={() => {
                                    setShowConfirmDelStaff(false);
                                    setManagerData(null);
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={() => {
                                    delStaff();
                                    setShowConfirmDelStaff(false);
                                    setManagerData(null);
                                }}
                                className={cx('del-btn')}
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
                    data={shopData}
                    onCloseModal={(updated) => {
                        if (updated) {
                            getListShop();
                        }
                        setShowShopForm(false);
                        setShopData(false);
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
                    <Col md={4}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <BsShop className={cx('icon', 'warning')} />
                                    Thông tin cửa hàng
                                </div>
                                <div className={cx('content-subtitle')}>
                                    <div onClick={() => setShowShopForm(true)} className={cx('icon')}>
                                        <RiAddCircleFill />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('content-body')}>
                                {listShop &&
                                    listShop.map((shop, index) => (
                                        <div key={index} className={cx('shop-wrapper')}>
                                            <div className={cx('shop-img-wrapper')}>
                                                <Image src={shop.image} className={cx('shop-img')} />
                                            </div>
                                            <div
                                                className={cx(
                                                    'd-flex',
                                                    'justify-content-between',
                                                    'align-items-center',
                                                )}
                                            >
                                                <div>
                                                    <div className={cx('shop-info')}>
                                                        <span>Địa chỉ :</span> {shop.address}{' '}
                                                        <span>- Cơ sở {shop.idShop}</span>
                                                    </div>
                                                    <div className={cx('shop-info')}>
                                                        <span>Trạng thái :</span>{' '}
                                                        {shop.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                                    </div>
                                                </div>
                                                <Tippy content="Chỉnh sửa" placement="bottom">
                                                    <div>
                                                        <RiEditCircleFill
                                                            onClick={() => {
                                                                setShowShopForm(true);
                                                                setShopData(shop);
                                                            }}
                                                            className={cx('update-img-btn', { disable: userRole < 2 })}
                                                        />
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <IoPeopleSharp className={cx('icon')} />
                                    Danh sách quản lý
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
                                            <th className={cx('text-center')}>CS quản lý</th>
                                            <th className={cx('text-center')}>Số điện thoại</th>
                                            <th className={cx('text-end')}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listManager &&
                                            listManager.map((staff, index) => (
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
                                                    <td className={cx('text-center')}>Cơ sở {staff.idShop}</td>
                                                    <td className={cx('text-center')}>{staff.phone}</td>
                                                    <td className={cx('text-end')}>
                                                        <div className={cx('staff-actions')}>
                                                            <Tippy content="Chỉnh sửa" placement="bottom" duration={0}>
                                                                <div
                                                                    onClick={() => {
                                                                        setShowStaffForm(true);
                                                                        setManagerData(staff);
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
                                                                        setManagerData(staff);
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

export default ShopPage;
