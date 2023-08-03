import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import { Col, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { priceFormat } from '../../utils/format';
import RecipeForm from './RecipeForm';
const cx = classNames.bind(styles);

function RecipeItem({ data = {}, onClickEditRecipe = () => {} }) {
    const [active, setActive] = useState(!data.isDel);
    useEffect(() => {
        setActive(!data.isDel);
    }, [data]);
    const localStorageManage = LocalStorageManager.getInstance();
    const userRole = localStorageManage.getItem('userInfo').role;
    const editMenuItem = async (activeValue = active) => {
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await adminService.editRecipe(data.idRecipe, token, activeValue ? '0' : 1);
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
            <div className={cx('recipe-item', { inactive: !active })}>
                <div className={cx('recipe-content')}>
                    <div className={cx('recipe-img-wrapper')}>
                        <Image src={data.image} className={cx('recipe-img')} />
                    </div>
                    <div className={cx('recipe-info')}>
                        <div className={cx('recipe-name')}>{data.name}</div>
                        <div className={cx('recipe-price')}>{priceFormat(data.price)}đ</div>
                    </div>
                </div>
                <div className={cx('recipe-actions')}>
                    <Tippy content={active ? 'Ngưng Sử dụng' : 'Sử dụng'} placement="bottom" duration={0}>
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
                                onClickEditRecipe();
                            }}
                            className={cx('recipe-edit')}
                        >
                            <MdOutlineInfo />
                        </div>
                    </Tippy>
                </div>
            </div>
        </>
    );
}

export default RecipeItem;
