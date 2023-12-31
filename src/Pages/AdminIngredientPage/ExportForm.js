import styles from './AdminIngredientPage.module.scss';
import classNames from 'classnames/bind';
import Modal from '../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import * as ingredientService from '../../services/ingredientService';
import { StoreContext, actions } from '../../store';
import { BiImport, BiExport } from 'react-icons/bi';
import { ingredientFormat, onlyNumber, priceFormat, priceFormatNoFixed, unitFormatL } from '../../utils/format';
import { Badge, Button, Form, Input, InputNumber, Popconfirm, Select, Skeleton, Space, Spin } from 'antd';
import { BsCheckCircle, BsDashCircle, BsPlusCircle } from 'react-icons/bs';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
const cx = classNames.bind(styles);

function ExportForm({ onCloseModal = () => {} }) {
    const [loading, setLoading] = useState(false);
    const [exportData, setExportData] = useState(false);
    const [ingredients, setIngredients] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const [form] = Form.useForm();

    const confirmExportIngredients = async (values) => {
        setLoading(true);
        if (exportData.description !== values.description) {
            await updateDescription(values.description);
        }
        if (values.ingredients && values.ingredients.length) {
            await addIngredientExport();
        }
        const results = await ingredientService.completeExport(exportData.id);
        if (results) {
            state.showToast('Xuất nguyên liệu', results.message);
            onCloseModal(true);
        }
        setLoading(false);
    };
    const createNewExport = async () => {
        setLoading(true);
        const results = await ingredientService.createExport();
        if (results) {
            const results2 = await ingredientService.getDetailExport(results.data.id);
            if (results2) {
                setExportData(results2);
            }
        }
        setLoading(false);
    };
    const addIngredientExport = async () => {
        const exportIngredient = form.getFieldValue('ingredients') || [];
        const filteredData = exportIngredient.filter(
            (item) => item && item.id !== undefined && item.quantity !== undefined && item.price !== undefined,
        );
        const ingredientId = filteredData.map((item) => item && item.id).join(',');
        const quantity = filteredData
            .map((item) => {
                const unitName =
                    ingredients.find((ingredient) => item && ingredient.id === item.id) &&
                    ingredients.find((ingredient) => item && ingredient.id === item.id).unitName;
                if (ingredients && unitName === 'pcs') {
                    return item && item.quantity;
                } else return item && item.quantity * 1000;
            })
            .join(',');
        const price = filteredData.map((item) => item && item.price).join(',');
        const results = await ingredientService.createExportIngredient({
            exportId: exportData.id,
            ingredientId,
            quantity,
            price,
        });
        if (results) {
            state.showToast(results.message);
            createNewExport();
            getExportIngredient();
            form.setFieldValue('ingredients', []);
        }
    };
    const delIngredientExport = async (ingredientId) => {
        console.log(ingredientId);
        const results = await ingredientService.deleteExportIngredient({ exportId: exportData.id, ingredientId });
        if (results) {
            state.showToast(results.message);
            createNewExport();
            getExportIngredient();
        }
    };
    const cancelExport = async () => {
        const results = await ingredientService.cancelExport(exportData.id);
        if (results) {
            state.showToast(results.message);
            onCloseModal();
        }
    };
    const updateDescription = async (description) => {
        const results = await ingredientService.updateExport(exportData.id, { description });
        if (results) {
            state.showToast(results.message);
        }
    };
    const getExportIngredient = async () => {
        if (exportData) {
            setLoading(true);
            const results = await ingredientService.getListIngredientToExport(exportData.id);
            if (results) {
                setIngredients(results.data);
            }
            setLoading(false);
        }
    };
    useEffect(() => {
        createNewExport();
    }, []);
    useEffect(() => {
        getExportIngredient();
    }, [exportData]);

    const items = [
        {
            key: '1',
            label: 'Thời gian tạo',
            children: exportData && dayjs(exportData.date).format('HH:mm DD/MM/YYYY'),
        },
        {
            key: '2',
            label: 'Nhân viên xử lý',
            children: exportData && exportData.staff && exportData.staff.name,
        },
        {
            key: '3',
            label: 'Trạng thái',
            children: exportData && (
                <Badge
                    status={
                        exportData.isCompleted === 1 ? 'success' : exportData.isCompleted === 0 ? 'error' : 'default'
                    }
                    text={
                        exportData.isCompleted === 1
                            ? 'Đã hoàn thành'
                            : exportData.isCompleted === 0
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
                <div className={cx('form-title')}>Xuất nguyên liệu </div>
                {items.map((item, index) => (
                    <p key={index} style={{ color: '#666', fontSize: 16 }}>
                        {item.label} : <span style={{ color: '#000', fontWeight: 500 }}>{item.children}</span>
                    </p>
                ))}
                <Form form={form} size="large" onFinish={confirmExportIngredients}>
                    {exportData.description && (
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả xuất hàng',
                                },
                            ]}
                            label="Mô tả : "
                            name="description"
                            initialValue={exportData.description}
                        >
                            <Input style={{ flex: 1, minWidth: 150 }} size="large" />
                        </Form.Item>
                    )}
                    {exportData &&
                        exportData.export_ingredients &&
                        exportData.export_ingredients.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{ gap: 10, marginBottom: 15 }}
                                    className={cx('align-items-end', 'd-flex')}
                                >
                                    <Input
                                        style={{ flex: 1, width: 220 }}
                                        defaultValue={item.ingredient && item.ingredient.name}
                                        size="large"
                                        disabled
                                    />
                                    <Input
                                        style={{ width: 120 }}
                                        addonAfter={item.ingredient && unitFormatL(item.ingredient.unitName)}
                                        defaultValue={item.quantity / 1000}
                                        size="large"
                                        disabled
                                    />
                                    <Input
                                        style={{ width: 180 }}
                                        suffix=".000"
                                        addonAfter={'VND'}
                                        defaultValue={priceFormatNoFixed(item.price)}
                                        size="large"
                                        disabled
                                    />

                                    <Popconfirm
                                        title="Huỷ món"
                                        description="Bạn chắc chắn huỷ món này?"
                                        onConfirm={() => delIngredientExport(item.ingredient && item.ingredient.id)}
                                        okButtonProps={{ loading: loading }}
                                        okText="Huỷ món"
                                        cancelText="Quay lại"
                                    >
                                        <BsDashCircle className={cx('dynamic-delete-button')} />
                                    </Popconfirm>
                                </div>
                            );
                        })}

                    <Form.List
                        name="ingredients"
                        rules={[
                            {
                                validator: async (_, names) => {
                                    if (
                                        (!names || names.length < 1) &&
                                        exportData &&
                                        exportData.export_ingredients.length === 0
                                    ) {
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
                                            style={{ gap: 10 }}
                                            className={cx('align-items-center', 'd-flex')}
                                        >
                                            <ExportItem field={field} ingredients={ingredients} />

                                            {(fields.length > 1 ||
                                                (exportData && exportData.export_ingredients.length !== 0)) && (
                                                <BsDashCircle
                                                    className={cx('dynamic-delete-button')}
                                                    onClick={() => remove(field.name)}
                                                />
                                            )}
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
                                            disabled={
                                                !form.getFieldValue('ingredients') ||
                                                form.getFieldValue('ingredients').length === 0
                                            }
                                            size="middle"
                                            type="primary"
                                            onClick={() => {
                                                addIngredientExport();
                                            }}
                                            icon={<BsCheckCircle />}
                                        >
                                            Xác nhận thêm
                                        </Button>
                                    </div>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Space className={cx('content-end')}>
                        <Popconfirm
                            title="Huỷ đơn"
                            description="Bạn chắc chắn huỷ đơn này?"
                            onConfirm={() => cancelExport()}
                            okButtonProps={{ loading: loading }}
                            okText="Huỷ đơn"
                            cancelText="Quay lại"
                        >
                            <Form.Item style={{ margin: 0 }}>
                                <Button size="large">Huỷ đơn</Button>
                            </Form.Item>
                        </Popconfirm>
                        <Form.Item style={{ margin: 0 }}>
                            <Button loading={loading} size="large" type="primary" htmlType="submit">
                                Hoàn thành
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
            </Spin>
        </Modal>
    );
}

export default ExportForm;
function ExportItem({ field, ingredients }) {
    const { key, ...restField } = field;
    const [unit, setUnit] = useState();
    const [maxQuantity, setMaxQuantity] = useState();
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const onChangeIngredient = (value) => {
        const ingredient = ingredients && ingredients.find((item) => item.id === value);
        setUnit(ingredient.unitName);
        setMaxQuantity(ingredient.quantity);
    };
    return (
        <>
            <Form.Item
                {...restField}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập',
                    },
                ]}
                name={[field.name, 'id']}
            >
                <Select
                    showSearch
                    filterOption={filterOption}
                    options={
                        ingredients &&
                        ingredients.map((item) => {
                            return {
                                label: item.name + ' (' + ingredientFormat(item.quantity, item.unitName) + ' left)',
                                value: item.id,
                            };
                        })
                    }
                    style={{ flex: 1, width: 220 }}
                    placeholder="Chọn nguyên liệu"
                    onChange={onChangeIngredient}
                />
            </Form.Item>
            <Form.Item
                {...restField}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập',
                    },
                ]}
                name={[field.name, 'quantity']}
            >
                <InputNumber
                    // className={cx('w-100')}
                    max={maxQuantity / 1000}
                    style={{ width: 120 }}
                    min={0}
                    placeholder="Số lượng"
                    controls={false}
                    addonAfter={unitFormatL(unit)}
                />
            </Form.Item>
            <Form.Item
                {...restField}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập',
                    },
                ]}
                name={[field.name, 'price']}
            >
                <InputNumber
                    // className={cx('w-100')}

                    style={{ width: 180 }}
                    min={0}
                    placeholder="Đơn giá"
                    controls={false}
                    suffix=".000"
                    addonAfter={'VND'}
                    formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
            </Form.Item>
        </>
    );
}
