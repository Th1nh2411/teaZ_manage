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

function ImportForm({ selectedIngredient, onCloseModal = () => {} }) {
    const [priceValue, setPriceValue] = useState('');
    const [quantityValue, setQuantityValue] = useState(100);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManage = LocalStorageManager.getInstance();

    const importIngredients = async (e) => {
        e.preventDefault();
        const token = localStorageManage.getItem('token');
        if (token) {
            const results = await ingredientService.importIngredient(
                priceValue,
                quantityValue,
                selectedIngredient.idIngredient,
                token,
            );
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Đã nhập thêm nguyên liệu',
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
                <div className={cx('form-title')}>Nhập nguyên liệu </div>
                <div className={cx('d-flex')}>
                    <div className={cx('ingredient-name')}>Tên : {selectedIngredient.name} </div>
                    <div className={cx('ingredient-remain')}>
                        ( còn lại {selectedIngredient.quantity}
                        {selectedIngredient.unitName} )
                    </div>
                </div>
                <Input
                    className={cx('price-input')}
                    onChange={(event) => {
                        if (onlyNumber(event.target.value)) {
                            setPriceValue(event.target.value);
                        }
                    }}
                    value={priceValue}
                    unit=".000 vnđ"
                    title="Giá nhập nguyên liệu"
                    type="text"
                />
                <div className={cx('quantity-wrapper')}>
                    <span>Số lượng nhập:</span>
                    <select
                        className={cx('quantity-select')}
                        value={quantityValue}
                        onChange={(event) => {
                            setQuantityValue(event.target.value);
                        }}
                    >
                        {[...Array(1000).keys()].map((value) => (
                            <option key={value + 1} value={value + 1}>
                                {value + 1}
                            </option>
                        ))}
                    </select>
                    {selectedIngredient.unitName}
                </div>
                <Button primary rightIcon={<BiImport />} className={cx('action-btn')}>
                    Nhập hàng
                </Button>
            </form>
        </Modal>
    );
}

export default ImportForm;
