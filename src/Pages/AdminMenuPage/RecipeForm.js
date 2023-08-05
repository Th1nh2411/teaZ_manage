import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
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

const cx = classNames.bind(styles);

function RecipeForm({ idRecipe, onCloseModal = () => {} }) {
    const [detailRecipe, setDetailRecipe] = useState({});
    const [name, setNameValue] = useState('');
    const [image, setImageValue] = useState('');
    const [info, setInfoValue] = useState('');
    const [price, setPriceValue] = useState('');
    const [discount, setDiscountValue] = useState('');
    const [idType, setType] = useState(1);
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();
    const editMenuItem = async () => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.editRecipe(idRecipe, token, {
                name,
                image,
                info,
                price,
                discount,
                idType,
            });
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
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.addRecipe(name, image, info, price, idType, token);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Thêm mới sản phẩm thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
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
                setImageValue(results.detailRecipe.image);
                setInfoValue(results.detailRecipe.info);
                setPriceValue(results.detailRecipe.price);
                setType(results.detailRecipe.idType);
            }
        }
    };

    const handleCancelEdit = () => {
        setNameValue(detailRecipe.name);
        setImageValue(detailRecipe.image);
        setInfoValue(detailRecipe.info);
        setPriceValue(detailRecipe.price);
        setType(detailRecipe.idType);
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
                detailRecipe.image !== image ||
                detailRecipe.info !== info ||
                detailRecipe.price !== Number(price) ||
                detailRecipe.idType !== Number(idType)
            ) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        } else {
            if (name !== '' || image !== '' || info !== '' || price !== '' || idType !== 1) {
                setValueChange(true);
            } else {
                setValueChange(false);
            }
        }
    }, [name, price, info, image, idType]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('edit-form-wrapper')}
        >
            <div className={cx('form-title')}>{idRecipe ? 'Cập nhật thông tin sản phẩm' : 'Thêm mới sản phẩm'}</div>
            <form onSubmit={handleClickConfirm} className={cx('form-body')}>
                {idRecipe && (
                    <div className={cx('left-section')}>
                        <div className={cx('form-img-wrapper')}>
                            <Image src={detailRecipe.image} className={cx('form-img')} />
                        </div>
                        <Input
                            onChange={(event) => {
                                setImageValue(event.target.value);
                            }}
                            value={image}
                            title="Đường dẫn ảnh"
                            type="text"
                        />
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
                                value={price}
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
                                        setPriceValue(event.target.value);
                                        setValueChange(true);
                                    }
                                }}
                                value={price}
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
                        <Input
                            onChange={(event) => {
                                setImageValue(event.target.value);
                            }}
                            value={image}
                            title="Đường dẫn ảnh"
                            type="text"
                        />
                    )}
                    {idRecipe && (
                        <ListIngredient
                            onUpdateIngredient={async () => await getDetailRecipe()}
                            detailRecipe={detailRecipe}
                        />
                    )}
                    <div className={cx('form-actions')}>
                        {valueChange && <Button onClick={handleCancelEdit}>Hủy</Button>}
                        <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default RecipeForm;
