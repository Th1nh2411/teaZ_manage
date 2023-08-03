import styles from './AdminReportPage.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Chart, registerables } from 'chart.js';
import { formatNumber } from '../../utils/format';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as adminService from '../../services/adminService';
import { Colors } from 'chart.js';

Chart.register(Colors);
Chart.register(...registerables);

const cx = classNames.bind(styles);
const customColor = [['#ffc107', '#fd7e14', '#0d6efd', '#20c997', '#0dcaf0', '#dc3545', '#198754']];
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CompareTracker = ({ className }) => {
    const [reportAllShop, setReportAllShop] = useState([]);
    const localStorageManager = LocalStorageManager.getInstance();
    const getIngredientReport = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const listShopResults = await adminService.getListShop(token);
            if (listShopResults) {
                for (let i = 0; i < listShopResults.listShops.length; i++) {
                    const results = await adminService.getDataForChartByShop(
                        listShopResults.listShops[i].idShop,
                        token,
                    );
                    if (results) {
                        const shopReport = results.listTotalAndTotalAmountImport;
                        setReportAllShop((prev) => [...prev, { idShop: results.idShop, data: shopReport }]);
                    }
                }
            }
        }
    };
    useEffect(() => {
        getIngredientReport();
    }, []);
    const labels = useMemo(() => {
        const listMonths =
            reportAllShop && reportAllShop[1] && reportAllShop[1].data.map((item, index) => months[item.month]);
        return listMonths;
    }, [reportAllShop]); //['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const data = useMemo(() => {
        return {
            labels,
            datasets:
                reportAllShop &&
                reportAllShop.map((shop, index) => {
                    return {
                        // fill: true,
                        label: `Cơ sở ${shop.idShop}`,
                        data: shop && shop.data.map((month) => month.total),
                        borderColor: Colors[index],
                        backgroundColor: Colors[index],
                        color: 'black',
                        fontSize: '16px',
                        // pointBackgroundColor: 'none',
                        // pointBorderColor: 'none',
                    };
                }),
        };
    }, [labels]);
    const options = {
        colors: {
            enabled: true,
        },
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'black',
                    font: {
                        size: 16,
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    color: 'black',
                    // padding: 10,
                    font: { size: 16 },
                    // autoSkipPadding: 10,
                    //  stepSize: 10
                    callback: function (value, index, ticks) {
                        return formatNumber(value);
                    },
                },
                grid: {
                    display: false,
                },
            },
            x: {
                ticks: { color: 'black', padding: 10, font: { size: 16 } },
                grid: {
                    display: false,
                },
            },
        },
    };
    return (
        <div className={cx('chart-wrapper', className)}>
            {reportAllShop && <Line height={450} data={data} options={options} />}
        </div>
    );
};

export default CompareTracker;
