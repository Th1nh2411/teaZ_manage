import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
// import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
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

function RecipeForm({ id, onCloseModal = () => {} }) {
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
    const editMenuItem = async () => {
        if (!name) {
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
        const results = await adminService.editRecipe(id, {
            name,
            image: res && res.url,
            info,
            price,
            discount: 100 - discount,
            idType,
        });
        setLoading(false);
        if (results) {
            state.showToast(results.message);

            onCloseModal(true);
        }
    };
    const addNewMenuItem = async () => {
        if (!name || !image) {
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
        const res = await adminService.uploadFile(image);
        const results = await adminService.addRecipe({ name, image: res.url, info, price, discount, idType });
        setLoading(false);
        if (results) {
            state.showToast('Thêm mới', results.message);

            onCloseModal(true);
        }
    };
    const getDetailRecipe = async () => {
        const results = await adminService.getDetailRecipe(id);
        if (results) {
            setDetailRecipe(results.data);
            setNameValue(results.data.name);
            setInfoValue(results.data.info);
            setPriceValue(results.data.price);
            setDiscountValue(100 - results.data.discount);
            setType(results.data.idType);
        }
    };

    const handleCancelEdit = () => {
        setImageValue(null);
        if (id) {
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
        if (id) {
            editMenuItem();
        } else {
            addNewMenuItem();
        }
    };
    useEffect(() => {
        if (id) {
            getDetailRecipe();
        }
    }, []);
    useEffect(() => {
        if (id) {
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
                <div className={cx('form-title')}>{id ? 'Cập nhật thông tin sản phẩm' : 'Thêm mới sản phẩm'}</div>
                <div className={cx('form-body')}>
                    {id && (
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
                        {!id && (
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
                        {id && (
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
