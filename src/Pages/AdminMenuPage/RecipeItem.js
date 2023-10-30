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
import { Badge, Popconfirm, Switch } from 'antd';
const cx = classNames.bind(styles);

function RecipeItem({ data = {}, onClickEditRecipe = () => {}, onChangeActive = () => {} }) {
    const [state, dispatch] = useContext(StoreContext);
    const [active, setActive] = useState(data.isActive);
    useEffect(() => {
        setActive(data.isActive);
    }, [data]);
    const userRole = state.userInfo && state.userInfo.role;
    const editMenuItem = async () => {
        const results = await adminService.changeRecipeActive(data.id);
        if (results) {
            state.showToast(results.message);
            if (active) setActive(0);
            else setActive(1);
            // onChangeActive();
        }
    };
    return (
        <>
            <div className={cx('recipe-item', { inactive: active === 0 || active === 2 })}>
                {data.discount !== 0 && <div className={cx('sale-off')}>-{100 - data.discount}%</div>}
                <div className={cx('recipe-content')}>
                    <div className={cx('recipe-img-wrapper')}>
                        <Image src={data.image} className={cx('recipe-img')} />
                    </div>

                    <div className={cx('recipe-info')}>
                        <div className={cx('recipe-name')}>{data.name}</div>
                        <Badge
                            status={active === 0 ? 'default' : active === 1 ? 'success' : 'error'}
                            text={
                                active === 0 ? 'Không hoạt động' : active === 1 ? 'Đang hoạt động' : 'Hết nguyên liệu'
                            }
                        />
                        <div className={cx('recipe-price')}>{priceFormat(data.price)}đ</div>
                    </div>
                </div>
                <div className={cx('recipe-actions')}>
                    {/* <Tippy content={active ? 'Ngưng Sử dụng' : 'Sử dụng'} placement="bottom" duration={0}> */}
                    <Popconfirm
                        title={active ? 'Ngưng sử dụng' : 'Sử dụng'}
                        description={active ? 'Ngưng sử dụng nguyên liệu này?' : 'Sử dụng lại nguyên liệu này?'}
                        onConfirm={editMenuItem}
                        okText={'Xác nhận'}
                        cancelText="Huỷ"
                    >
                        <Switch checked={active} disabled={userRole < 2} style={{}} />
                    </Popconfirm>
                    {/* </Tippy> */}
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
