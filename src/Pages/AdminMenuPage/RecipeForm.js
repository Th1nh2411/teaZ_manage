import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
// import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import { RiAddCircleFill } from 'react-icons/ri';
import ListIngredient from './ListIngredient';
import { Upload, Button, message } from 'antd';
import { BiUpload } from 'react-icons/bi';

const cx = classNames.bind(styles);

function RecipeForm({ idRecipe, onCloseModal = () => {} }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [detailRecipe, setDetailRecipe] = useState({});
    const [name, setNameValue] = useState('');
    const [image, setImageValue] = useState(null);
    const [info, setInfoValue] = useState('');
    const [price, setPriceValue] = useState('');
    const [discount, setDiscountValue] = useState('');
    const [idType, setType] = useState(1);
    const [loading, setLoading] = useState(false);
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const editMenuItem = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            setLoading(true);
            const res = image && (await adminService.uploadFile(image));
            const results = await adminService.editRecipe(idRecipe, token, {
                name,
                image: res && res.url,
                info,
                price,
                discount: 100 - discount,
                idType,
            });
            setLoading(false);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Cập nhật thông tin sản phẩm thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            }
        }
    };
    const addNewMenuItem = async () => {
        if (!name || !image || !info || !price || !discount || !idType) {
            messageApi.open({
                type: 'error',
                content: 'Vui lòng nhập đầy đủ thông tin',
                style: {
                    zIndex: '100000000',
                },
            });
            return;
        }
        const token = localStorageManage.getItem('token');
        if (token) {
            setLoading(true);
            const res = await adminService.uploadFile(image);
            const results = await adminService.addRecipe(name, res.url, info, price, 100 - discount, idType, token);
            setLoading(false);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Thêm mới sản phẩm thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            } else {
            }
        }
    };
    const getDetailRecipe = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.getDetailRecipe(idRecipe, token);
            if (results && results.detailRecipe) {
                setDetailRecipe(results.detailRecipe);
                setNameValue(results.detailRecipe.name);
                setInfoValue(results.detailRecipe.info);
                setPriceValue(results.detailRecipe.price);
                setDiscountValue(100 - results.detailRecipe.discount);
                setType(results.detailRecipe.idType);
            }
        }
    };

    const handleCancelEdit = () => {
        setImageValue(null);
        if (idRecipe) {
            setNameValue(detailRecipe.name);
            setInfoValue(detailRecipe.info);
            setPriceValue(detailRecipe.price);
            setDiscountValue(100 - detailRecipe.discount);
            setType(detailRecipe.idType);
        } else {
            setNameValue('');
            setInfoValue('');
            setPriceValue('');
            setDiscountValue('');
            setType('');
        }
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        if (idRecipe) {
            editMenuItem();
        } else {
            addNewMenuItem();
        }
    };
    useEffect(() => {
        if (idRecipe) {
            getDetailRecipe();
        }
    }, []);
    useEffect(() => {
        if (idRecipe) {
            if (
                detailRecipe.name !== name ||
                image !== null ||
                detailRecipe.info !== info ||
                detailRecipe.price !== Number(price) ||
                100 - detailRecipe.discount !== Number(discount) ||
                detailRecipe.idType !== Number(idType)
            ) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        } else {
            if (name !== '' || image !== null || info !== '' || price !== '' || discount !== '' || idType !== 1) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        }
    }, [name, price, info, image, discount, idType]);
    return (
        <>
            <Modal
                handleClickOutside={() => {
                    onCloseModal();
                }}
                className={cx('edit-form-wrapper')}
            >
                {contextHolder}
                <div className={cx('form-title')}>{idRecipe ? 'Cập nhật thông tin sản phẩm' : 'Thêm mới sản phẩm'}</div>
                <div className={cx('form-body')}>
                    {idRecipe && (
                        <div className={cx('left-section')}>
                            <div className={cx('form-img-wrapper')}>
                                <Image src={detailRecipe.image} className={cx('form-img')} />
                            </div>
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
                    )}
                    <div className={cx('form-info')}>
                        <Input
                            onChange={(event) => {
                                setNameValue(event.target.value);
                            }}
                            value={name}
                            title="Tên món"
                            type="text"
                        />
                        <Input
                            onChange={(event) => {
                                setInfoValue(event.target.value);
                            }}
                            value={info}
                            title="Thông tin món ăn"
                            type="text"
                            required={false}
                        />
                        <Row>
                            <Col md={4}>
                                <Input
                                    // className={cx('flex-grow-1')}
                                    onChange={(event) => {
                                        if (onlyNumber(event.target.value)) {
                                            setPriceValue(event.target.value);
                                            setValueChange(true);
                                        }
                                    }}
                                    value={Number(price)}
                                    unit=".000 vnđ"
                                    title="Giá món"
                                    type="text"
                                />
                            </Col>
                            <Col md={4}>
                                <Input
                                    // className={cx('flex-grow-1')}
                                    onChange={(event) => {
                                        if (onlyNumber(event.target.value)) {
                                            setDiscountValue(event.target.value);
                                            setValueChange(true);
                                        }
                                    }}
                                    value={Number(discount)}
                                    unit="%"
                                    title="Discount"
                                    type="text"
                                />
                            </Col>
                            <Col md={4}>
                                <select
                                    className={cx('custom-select')}
                                    value={idType}
                                    onChange={(event) => {
                                        setType(event.target.value);
                                    }}
                                >
                                    <option value={1}>Thức uống</option>
                                    <option value={2}>Cà phê</option>
                                    <option value={3}>Trà</option>
                                    <option value={4}>Bakery</option>
                                    <option value={5}>Topping</option>
                                </select>
                            </Col>
                        </Row>
                        {!idRecipe && (
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
                        )}
                        {idRecipe && (
                            <ListIngredient
                                onUpdateIngredient={async () => await getDetailRecipe()}
                                detailRecipe={detailRecipe}
                            />
                        )}
                        <div className={cx('form-actions')}>
                            {valueChange && (
                                <Button size="large" onClick={handleCancelEdit}>
                                    Hủy
                                </Button>
                            )}
                            <Button
                                disabled={!valueChange}
                                loading={loading}
                                onClick={handleClickConfirm}
                                size="large"
                                className={cx('confirm-btn')}
                                type="primary"
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default RecipeForm;
