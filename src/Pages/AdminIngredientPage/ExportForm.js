import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import * as ingredientService from '../../services/ingredientService';
import { StoreContext, actions } from '../../store';
import { BiImport, BiExport } from 'react-icons/bi';
import Input from '../../components/Input/Input';
import { onlyNumber } from '../../utils/format';
import { InputNumber, Select } from 'antd';
const cx = classNames.bind(styles);

function ExportForm({ selectedIngredient, onCloseModal = () => {} }) {
    const [infoValue, setInfoValue] = useState('Hết HSD');
    const [quantityValue, setQuantityValue] = useState(1);
    const [state, dispatch] = useContext(StoreContext);

    const importIngredients = async (e) => {
        e.preventDefault();

        const results = await ingredientService.exportIngredient(
            infoValue,
            selectedIngredient.unitName === 'pcs' ? quantityValue : quantityValue * 1000,
            selectedIngredient.idIngredient,
        );
        if (results) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: 'Xuất nguyên liệu thành công',
                    title: 'Thành công',
                }),
            );
            onCloseModal(true);
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
                    <span>Lý do xuất :</span>
                    <Select
                        className={cx('quantity-select')}
                        value={infoValue}
                        onChange={(value) => {
                            setInfoValue(value);
                        }}
                        dropdownStyle={{ zIndex: 1000000 }}
                        options={[
                            { value: 'Hết HSD', label: 'Hết HSD' },
                            { value: 'Hư, hỏng', label: 'Hư, hỏng' },
                            { value: 'Lỗi đặt hàng', label: 'Lỗi đặt hàng' },
                            { value: 'Không dùng tới', label: 'Không dùng tới' },
                        ]}
                    />
                </div>
                <div className={cx('quantity-wrapper')}>
                    <span>Số lượng xuất :</span>
                    <InputNumber
                        className={cx('quantity-select')}
                        value={quantityValue}
                        onChange={(value) => {
                            setQuantityValue(value);
                        }}
                        min={0}
                        max={
                            selectedIngredient.unitName === 'pcs'
                                ? selectedIngredient.quantity
                                : selectedIngredient.quantity / 1000
                        }
                        addonAfter={
                            selectedIngredient.unitName === 'g'
                                ? 'kg'
                                : selectedIngredient.unitName === 'ml'
                                ? 'lít'
                                : 'pcs'
                        }
                    />
                </div>
                <Button primary rightIcon={<BiImport />} className={cx('action-btn')}>
                    Xuất hàng
                </Button>
            </form>
        </Modal>
    );
}

export default ExportForm;
