import styles from './OrderItem.module.scss';
import classNames from 'classnames/bind';
import Image from '../Image';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { Col, Form } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as menuService from '../../services/menuService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import EditItemForm from './EditItemForm';

const cx = classNames.bind(styles);

function OrderItem({ data = {}, onUpdateRecipe = () => {} }) {
    const { Recipe, discount, isActive } = data;
    const [active, setActive] = useState(isActive);
    const [showEditForm, setShowEditForm] = useState();
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const editMenuItem = async (activeValue = active) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await menuService.editMenuItem(Recipe.idRecipe, activeValue, discount, token);
        }
    };

    const handleCheckBoxActive = (e) => {
        if (e.target.checked) {
            setActive(true);
            editMenuItem(true);
        } else {
            setActive(false);
            editMenuItem(false);
        }
    };

    return (
        <>
            <div className={cx('order-item', { inactive: !active })}>
                {showEditForm && (
                    <EditItemForm
                        idRecipe={Recipe.idRecipe}
                        onCloseModal={(updated) => {
                            if (updated) {
                                onUpdateRecipe();
                            }
                            setShowEditForm(false);
                        }}
                    />
                )}
                {discount !== 0 && <div className={cx('sale-off')}>-{100 - discount}%</div>}
                <div className={cx('order-content')}>
                    <div className={cx('order-img-wrapper')}>
                        <Image src={Recipe.image} className={cx('order-img')} />
                    </div>
                    <div className={cx('order-info')}>
                        <div className={cx('order-name')}>{Recipe.name}</div>
                        <div className={cx('order-price')}>{priceFormat(Recipe.price)}đ</div>
                    </div>
                </div>
                <div className={cx('order-actions')}>
                    <Tippy content={active ? 'Ngưng bán' : 'Mở bán'} placement="bottom" duration={0}>
                        <Form.Check
                            className={cx('policy-check')}
                            checked={active}
                            type="checkbox"
                            isValid
                            onChange={(e) => handleCheckBoxActive(e)}
                            disabled={userRole < 2}
                        />
                    </Tippy>
                    <Tippy content="Xem chi tiết" placement="bottom" duration={0}>
                        <div
                            onClick={() => {
                                setShowEditForm(true);
                            }}
                            className={cx('order-edit')}
                        >
                            <MdOutlineInfo />
                        </div>
                    </Tippy>
                </div>
            </div>
        </>
    );
}

export default OrderItem;
