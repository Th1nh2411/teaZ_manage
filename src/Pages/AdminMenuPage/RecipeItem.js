import styles from './AdminMenuPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import { Col, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { priceFormat } from '../../utils/format';
import RecipeForm from './RecipeForm';
import { StoreContext } from '../../store';
const cx = classNames.bind(styles);

function RecipeItem({ data = {}, onClickEditRecipe = () => {} }) {
    const [state, dispatch] = useContext(StoreContext);
    const [active, setActive] = useState(data.isActive);
    useEffect(() => {
        setActive(data.isActive);
    }, [data]);
    const userRole = state.userInfo.role;
    const editMenuItem = async (activeValue) => {
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
            <div className={cx('recipe-item', { inactive: !active })}>
                {data.discount !== 0 && <div className={cx('sale-off')}>-{100 - data.discount}%</div>}
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
