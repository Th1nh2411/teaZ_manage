import styles from './IngredientPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import { Col, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as ingredientService from '../../services/ingredientService';
import Tippy from '@tippyjs/react';
import { GiMilkCarton } from 'react-icons/gi';
import { FaSort } from 'react-icons/fa';
import Input from '../../components/Input/Input';

const cx = classNames.bind(styles);

function IngredientPage() {
    const [defaultIngredients, setDefaultIngredients] = useState();
    const [ingredients, setIngredients] = useState();
    const [searchValue, setSearchValue] = useState('');
    const [sort, setSort] = useState(1);
    const [loading, setLoading] = useState();
    const getIngredients = async () => {
        setLoading(true);
        const results = await ingredientService.getListIngredient();
        if (results && results.ingredients) {
            setDefaultIngredients(results.ingredients.sort((a, b) => a.quantity - b.quantity));
            setIngredients(results.ingredients.sort((a, b) => a.quantity - b.quantity));
        }
        setLoading(false);
    };

    useEffect(() => {
        getIngredients();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {loading ? (
                <div className={cx('loader')}>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <Row>
                    <Col>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('content-header')}>
                                <div className={cx('content-title')}>
                                    <GiMilkCarton className={cx('icon', 'warning')} />
                                    Danh sách nguyên liệu
                                    <FaSort
                                        onClick={() => {
                                            if (sort === 0) {
                                                setSort(1);
                                                setIngredients(ingredients.sort((a, b) => a.quantity - b.quantity));
                                            } else {
                                                setSort(0);
                                                setIngredients(ingredients.sort((a, b) => b.quantity - a.quantity));
                                            }
                                        }}
                                        className={cx('sort-btn')}
                                    />
                                </div>
                                <div>
                                    <Input
                                        title={'Tìm nguyên liệu'}
                                        value={searchValue}
                                        onChange={(e) => {
                                            setSearchValue(e.target.value);
                                            setIngredients(
                                                defaultIngredients.filter((item) =>
                                                    item.name.toUpperCase().includes(e.target.value.toUpperCase()),
                                                ),
                                            );
                                        }}
                                    />
                                </div>
                                <div className={cx('content-subtitle')}>
                                    {ingredients && ingredients.length} nguyên liệu
                                </div>
                            </div>
                            <div className={cx('content-body')}>
                                {ingredients &&
                                    ingredients.map((ingredient, index) => (
                                        <div
                                            key={index}
                                            className={cx('ingredient-item', { inactive: ingredient.quantity === 0 })}
                                        >
                                            <div className={cx('ingredient-content')}>
                                                <div className={cx('ingredient-img-wrapper')}>
                                                    <Image src={ingredient.image} className={cx('ingredient-img')} />
                                                </div>
                                                <div className={cx('ingredient-info')}>
                                                    <div className={cx('ingredient-name')}>{ingredient.name}</div>
                                                    <div className={cx('ingredient-remain')}>
                                                        <span>Còn lại:</span>
                                                        {ingredient.quantity}
                                                        {ingredient.unitName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default IngredientPage;
