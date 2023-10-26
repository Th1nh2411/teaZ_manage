import styles from './OrderItem.module.scss';
import classNames from 'classnames/bind';
import Image from '../Image';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { Col, Form } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber, priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import DetailForm from './DetailForm';

const cx = classNames.bind(styles);

function OrderItem({ data = {}, onUpdateRecipe = () => {} }) {
    const [state, dispatch] = useContext(StoreContext);
    const [active, setActive] = useState(data.isActive);
    const [showEditForm, setShowEditForm] = useState();
    const userRole = state.userInfo && state.userInfo.role;
    const editMenuItem = async (activeValue = active) => {
        const results = await adminService.editRecipe(data.idRecipe, { isActive: activeValue });
    };

    const handleCheckBoxActive = (e) => {
        if (e.target.checked) {
            setActive(1);
            editMenuItem(1);
        } else {
            setActive(0);
            editMenuItem(0);
        }
    };

    return (
        <>
            <div className={cx('order-item', { inactive: !active })}>
                {showEditForm && (
                    <DetailForm
                        idRecipe={data.id}
                        onCloseModal={(updated) => {
                            if (updated) {
                                onUpdateRecipe();
                            }
                            setShowEditForm(false);
                        }}
                    />
                )}
                {data.discount !== 100 && <div className={cx('sale-off')}>-{100 - data.discount}%</div>}
                <div className={cx('order-content')}>
                    <div className={cx('order-img-wrapper')}>
                        <Image src={data.image} className={cx('order-img')} />
                    </div>
                    <div className={cx('order-info')}>
                        <div className={cx('order-name')}>{data.name}</div>
                        <div className={cx('order-price')}>{priceFormat(data.price)}đ</div>
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
