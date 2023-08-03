import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Input.module.scss';
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

function Input({
    required = true,
    errorMessage,
    errorCondition,
    value,
    onChange,
    onFocus,
    title,
    type = 'text',
    unit,
    disable = false,
    className,
}) {
    const unitRef = useRef();
    const [paddingRightInput, setPaddingRightInput] = useState('8px');
    useEffect(() => {
        if (unitRef) {
            setPaddingRightInput(unitRef.current.offsetWidth + 10);
        }
    }, [unitRef]);
    return (
        <div className={cx('input-container', { error: errorCondition }, className)}>
            <input
                disabled={disable}
                className={cx('form-input', {
                    hasValue: value,
                })}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                required={required}
                style={{ paddingRight: paddingRightInput }}
            />
            <p>{title}</p>
            <div ref={unitRef} className={cx('unit')}>
                {unit}
            </div>
            <span>
                <i />
            </span>
            {errorCondition && (
                <div id="error" className={cx('error-message')}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
}
Input.propTypes = {
    errorMessage: PropTypes.string,
    errorCondition: PropTypes.any,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string,
    type: PropTypes.string,
    unit: PropTypes.string,
};
export default Input;
