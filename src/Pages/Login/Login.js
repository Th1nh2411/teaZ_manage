import React, { useContext, useState } from 'react';
import images from '../../assets/images';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import * as authService from '../../services/authService';
import Input from '../../components/Input/Input';
import Card from '../../components/Card/Card';
import dayjs from 'dayjs';
import { StoreContext, actions } from '../../store';
import Cookies from 'js-cookie';
const cx = classNames.bind(styles);
const Login = ({ setAuth }) => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [state, dispatch] = useContext(StoreContext);
    const handleSubmit = (event) => {
        event.preventDefault();
        const getTokenApi = async () => {
            const results = await authService.login({ phone, password });
            if(results && results.userInfo && results.userInfo.role === 0){
                state.showToast('Đăng nhập', 'Sai tài khoản hoặc mật khẩu','error');
            }
            else if (results && results.userInfo && results.userInfo.role !== 0) {
                Cookies.set('userInfo', JSON.stringify(results.userInfo));
                dispatch(actions.setUserInfo(results.userInfo));
                state.showToast('Đăng nhập', results.message);

                navigate(config.routes.order);
            } 
        };
        getTokenApi();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('bg-wrapper')}>
                <img src={images.logo2} className={cx('bg-img')} alt="bg-img" />
            </div>
            <div className={cx('form-wrapper')}>
                <Card className={cx('form-container')}>
                    <div className={cx('form-title')}>Đăng nhập hệ thống quản lý</div>
                    {/* <img src={images.logo3} className={cx('logo')} alt="logo-img" /> */}

                    <form onSubmit={handleSubmit} className={cx('form-body')}>
                        <Input
                            onChange={(event) => {
                                setPhone(event.target.value);
                                setErrorMessage('');
                            }}
                            value={phone}
                            title="Nhập số điện thoại"
                        />

                        <Input
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setErrorMessage('');
                            }}
                            value={password}
                            title="Nhập mật khẩu"
                            errorMessage={errorMessage}
                            errorCondition={errorMessage}
                            type="password"
                        />
                        <Button className={cx('custom-btn')} primary type="submit">
                            Đăng nhập
                        </Button>
                        {/* <Link to={config.routes.forgot} className={cx('forgot-pw')}>
                                Quên mật khẩu?
                            </Link> */}
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
