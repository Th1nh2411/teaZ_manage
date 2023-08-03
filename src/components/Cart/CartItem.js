import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Image from '../Image/Image';
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import * as cartService from '../../services/cartService';

const cx = classNames.bind(styles);

function CartItem({ data = {}, onDelItem = () => {} }) {
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManager = LocalStorageManager.getInstance();
    const handleEditItem = () => {
        dispatch(actions.setDetailItem({ show: true, data: data, editing: true }));
    };
    const handleDelItem = async () => {
        const token = localStorageManager.getItem('token');
        const results = await cartService.delCartItem(data.idProduct, token);
        if (results) {
            onDelItem();
        }
    };
    return (
        <div className={cx('item-wrapper')}>
            <div className={cx('item-left-side')}>
                <div className={cx('item-img-wrapper')}>
                    <Image src={data.image} className={cx('item-img')} />
                </div>
                <div className={cx('item-info')}>
                    <div className={cx('item-name')}>
                        {data.name} ({data.size ? 'L' : 'M'}) x{data.quantityProduct}
                    </div>
                    <div className={cx('item-topping')}>
                        {data.listTopping.length !== 0 && <span>Topping :</span>}{' '}
                        {data.listTopping.map((topping) => topping.name).join(', ')}
                    </div>
                    <div className={cx('item-price')}>{priceFormat(data.totalProducts)}đ</div>
                    {/* <div className={cx('item-price')}></div> */}
                </div>
            </div>
            <div className={cx('item-actions')}>
                <div onClick={handleEditItem} className={cx('action-edit')}>
                    <AiTwotoneEdit />
                </div>
                <div onClick={handleDelItem} className={cx('action-del')}>
                    <AiTwotoneDelete />
                </div>
            </div>
        </div>
    );
}

export default CartItem;
