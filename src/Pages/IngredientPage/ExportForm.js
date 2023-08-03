import styles from './IngredientPage.module.scss';
import classNames from 'classnames/bind';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import * as ingredientService from '../../services/ingredientService';
import { StoreContext, actions } from '../../store';
import { BiImport, BiExport } from 'react-icons/bi';
import LocalStorageManager from '../../utils/LocalStorageManager';
import Input from '../../components/Input/Input';
import { onlyNumber } from '../../utils/format';
const cx = classNames.bind(styles);

function ExportForm({ selectedIngredient, onCloseModal = () => {} }) {
    const [infoValue, setInfoValue] = useState('Hết HSD');
    const [quantityValue, setQuantityValue] = useState(1);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();

    const importIngredients = async (e) => {
        e.preventDefault();
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await ingredientService.exportIngredient(
                infoValue,
                quantityValue,
                selectedIngredient.idIngredient,
                token,
            );
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Xuất nguyên liệu thành công',
                        title: 'Thành công',
                    }),
                );
                onCloseModal(true);
            }
        }
    };

    return (
        <Modal className={cx('form-wrapper')} handleClickOutside={() => onCloseModal()}>
            <form onSubmit={importIngredients}>
                <div className={cx('form-title')}>Xuất nguyên liệu </div>
                <div className={cx('d-flex')}>
                    <div className={cx('ingredient-name')}>Tên : {selectedIngredient.name} </div>
                    <div className={cx('ingredient-remain')}>
                        ( còn lại {selectedIngredient.quantity}
                        {selectedIngredient.unitName} )
                    </div>
                </div>
                <div className={cx('quantity-wrapper')}>
                    <span>Lý do xuất:</span>
                    <select
                        className={cx('quantity-select')}
                        value={infoValue}
                        onChange={(event) => {
                            setInfoValue(event.target.value);
                        }}
                    >
                        <option value="Hết HSD">Hết HSD</option>
                        <option value="Hư, hỏng">Hư, hỏng</option>
                        <option value="Lỗi đặt hàng">Lỗi đặt hàng</option>
                        <option value="Không dùng tới">Nguyên liệu cũ</option>
                        <option value="Tồn kho">Tồn kho</option>
                    </select>
                </div>
                <div className={cx('quantity-wrapper')}>
                    <span>Số lượng xuất:</span>
                    <select
                        className={cx('quantity-select')}
                        value={quantityValue}
                        onChange={(event) => {
                            setQuantityValue(event.target.value);
                        }}
                    >
                        {[...Array(selectedIngredient.quantity).keys()].map((value) => (
                            <option key={value + 1} value={value + 1}>
                                {value + 1}
                            </option>
                        ))}
                    </select>
                    {selectedIngredient.unitName}
                </div>
                <Button primary rightIcon={<BiImport />} className={cx('action-btn')}>
                    Xuất hàng
                </Button>
            </form>
        </Modal>
    );
}

export default ExportForm;
