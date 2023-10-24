import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
import Modal from '../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import * as ingredientService from '../../services/ingredientService';
import { StoreContext, actions } from '../../store';
import { BiImport, BiExport } from 'react-icons/bi';
import Input from '../../components/Input/Input';
import { ingredientFormat, onlyNumber } from '../../utils/format';
import { Badge, Button, Form, InputNumber, Popconfirm, Select, Skeleton, Space, Spin } from 'antd';
import { BsCheckCircle, BsDashCircle, BsPlusCircle } from 'react-icons/bs';
import dayjs from 'dayjs';
const cx = classNames.bind(styles);

function ImportForm({ onCloseModal = () => {} }) {
    const [loading, setLoading] = useState(false);
    const [importData, setImportData] = useState(false);
    const [ingredients, setIngredients] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const [form] = Form.useForm();

    const confirmImportIngredients = async () => {
        // setLoading(true);
        // const results = await ingredientService.importIngredient();
        // if (results) {
        //     state.showToast('Nhập nguyên liệu', results.message);
        //     onCloseModal(true);
        // }
        // setLoading(false);
    };
    const createNewImport = async () => {
        setLoading(true);
        const results = await ingredientService.createImport();
        if (results) {
            const results2 = await ingredientService.getDetailImport(results.data.id);
            if (results2) {
                setImportData(results2);
            }
        }
        setLoading(false);
    };
    const addIngredientImport = async () => {
        const importIngredient = form.getFieldsValue().ingredients || [];
        const ingredientId = importIngredient.map((item) => item.id).join(',');
        const quantity = importIngredient.map((item) => item.quantity).join(',');
        const price = importIngredient.map((item) => item.price).join(',');
        const results = await ingredientService.createImportIngredient({
            importId: importData.id,
            ingredientId,
            quantity,
            price,
        });
        if (results) {
            state.showToast(results.message);
        }
    };
    const delIngredientImport = async (ingredientId) => {
        const results = await ingredientService.deleteImportIngredient(ingredientId);
        if (results) {
            state.showToast(results.message);
        }
    };
    const cancelImport = async () => {
        const results = await ingredientService.cancelImport(importData.id);
        if (results) {
            state.showToast(results.message);
            onCloseModal();
        }
    };
    const getImportIngredient = async () => {
        if (importData) {
            setLoading(true);
            const results = await ingredientService.getListIngredientToImport(importData.id);
            if (results) {
                setIngredients(results.data);
            }
            setLoading(false);
        }
    };
    useEffect(() => {
        createNewImport();
    }, []);
    useEffect(() => {
        getImportIngredient();
    }, [importData]);

    const items = [
        {
            key: '1',
            label: 'Thời gian tạo',
            children: importData && dayjs(importData.date).format('HH:mm DD/MM/YYYY'),
        },
        {
            key: '2',
            label: 'Mô tả',
            children: importData && importData.description,
        },
        {
            key: '3',
            label: 'Nhân viên xử lý',
            children: importData && importData.staff && importData.staff.name,
        },
        {
            key: '4',
            label: 'Trạng thái',
            children: importData && (
                <Badge
                    status={
                        importData.isCompleted === 1 ? 'success' : importData.isCompleted === 0 ? 'error' : 'default'
                    }
                    text={
                        importData.isCompleted === 1
                            ? 'Đã hoàn thành'
                            : importData.isCompleted === 0
                            ? 'Chưa hoàn thành'
                            : 'Đã huỷ'
                    }
                />
            ),
        },
    ];
    return (
        <Modal className={cx('form-wrapper')} handleClickOutside={() => onCloseModal()}>
            <Spin spinning={loading}>
                <div className={cx('form-title')}>Nhập nguyên liệu </div>
                {items.map((item) => (
                    <p style={{ color: '#666', fontSize: 16 }}>
                        {item.label} : <span style={{ color: '#000', fontWeight: 500 }}>{item.children}</span>
                    </p>
                ))}
                {importData &&
                    importData.import_ingredients.map((ingredient, index) => {
                        return (
                            <div
                                key={ingredient.key}
                                style={{ gap: 10, marginBottom: 12 }}
                                className={cx('align-items-baseline', 'd-flex')}
                            >
                                <ImportItem ingredient={ingredient} ingredients={ingredients} />

                                {importData.ingredients.length > 1 ? (
                                    <BsDashCircle
                                        className={cx('dynamic-delete-button')}
                                        onClick={() => delIngredientImport(ingredient.id)}
                                    />
                                ) : null}
                            </div>
                        );
                    })}
                <Form form={form} size="large" onFinish={confirmImportIngredients} initialValues={[{}]}>
                    <Form.List
                        name="ingredients"
                        rules={[
                            {
                                validator: async (_, ingredients) => {
                                    if (!ingredients || ingredients.length < 1) {
                                        return Promise.reject(new Error('Phải có ít nhất 1 trường'));
                                    }
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => {
                                    return (
                                        <div
                                            key={field.key}
                                            style={{ gap: 10, marginBottom: 12 }}
                                            className={cx('align-items-baseline', 'd-flex')}
                                        >
                                            <ImportItem field={field} ingredients={ingredients} />

                                            {fields.length > 1 ? (
                                                <BsDashCircle
                                                    className={cx('dynamic-delete-button')}
                                                    onClick={() => remove(field.name)}
                                                />
                                            ) : null}
                                        </div>
                                    );
                                })}
                                <Form.Item>
                                    <div className={cx('align-items-center', 'd-flex')} style={{ gap: 10 }}>
                                        <Button
                                            size="middle"
                                            type="dashed"
                                            onClick={() => add()}
                                            icon={<BsPlusCircle />}
                                        >
                                            Thêm nguyên liệu
                                        </Button>
                                        <Button
                                            disabled={importData.ingredients === []}
                                            size="middle"
                                            type="primary"
                                            onClick={() => addIngredientImport()}
                                            icon={<BsCheckCircle />}
                                        >
                                            Xác nhận thêm
                                        </Button>
                                    </div>
                                </Form.Item>

                                <Form.ErrorList errors={errors} />
                            </>
                        )}
                    </Form.List>
                    <Space className={cx('content-end')}>
                        <Popconfirm
                            title="Huỷ đơn"
                            description="Bạn chắc chắn huỷ đơn này?"
                            onConfirm={() => {
                                form.setFieldsValue(['']);
                                cancelImport();
                            }}
                            okButtonProps={{ loading: loading }}
                            okText="Huỷ đơn"
                            cancelText="Quay lại"
                        >
                            <Button size="large">Huỷ đơn</Button>
                        </Popconfirm>
                        <Button loading={loading} size="large" type="primary" htmlType="submit">
                            Hoàn thành
                        </Button>
                    </Space>
                </Form>
            </Spin>
        </Modal>
    );
}

export default ImportForm;
function ImportItem({ field, disabled, ingredients }) {
    const [unit, setUnit] = useState();
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const onChangeIngredient = (value) => {
        const ingredient = ingredients && ingredients.find((item) => item.id === value);
        setUnit(ingredient.unitName);
    };
    return (
        <>
            <Form.Item
                // {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập trường này hoặc xoá nó đi',
                    },
                ]}
                noStyle
                name={[field.name, 'id']}
            >
                <Select
                    disabled={disabled}
                    showSearch
                    filterOption={filterOption}
                    options={
                        ingredients &&
                        ingredients.map((item) => {
                            return { label: item.name, value: item.id };
                        })
                    }
                    style={{ flex: 1, minWidth: 150 }}
                    placeholder="Chọn nguyên liệu"
                    onChange={onChangeIngredient}
                />
            </Form.Item>
            <Form.Item
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập trường này',
                    },
                ]}
                noStyle
                name={[field.name, 'quantity']}
            >
                <InputNumber
                    // className={cx('w-100')}
                    disabled={disabled}
                    style={{ width: 100 }}
                    min={0}
                    placeholder="Số lượng"
                    controls={false}
                    addonAfter={unit === 'g' ? 'kg' : unit === 'ml' ? 'l' : 'pcs'}
                />
            </Form.Item>
            <Form.Item
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập trường này',
                    },
                ]}
                noStyle
                name={[field.name, 'price']}
            >
                <InputNumber
                    // className={cx('w-100')}
                    disabled={disabled}
                    style={{ width: 160 }}
                    min={0}
                    placeholder="Đơn giá"
                    controls={false}
                    addonAfter={'VND'}
                    formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
            </Form.Item>
        </>
    );
}
