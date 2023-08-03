import styles from './ReportPage.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Chart, registerables } from 'chart.js';
import { formatNumber } from '../../utils/format';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as reportService from '../../services/reportService';
Chart.register(...registerables);

const cx = classNames.bind(styles);
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ProfitTracker = ({ className }) => {
    const [allProfit, setAllProfit] = useState([]);
    const [allImport, setAllImport] = useState([]);
    const [monthIndex, setMonthIndex] = useState([]);
    const localStorageManager = LocalStorageManager.getInstance();

    const getAllReport = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await reportService.get6PrevMonthReport(token);
            if (results && results.listTotalAndTotalAmountImport) {
                setAllProfit(results.listTotalAndTotalAmountImport.map((item) => item.total));
                setAllImport(results.listTotalAndTotalAmountImport.map((item) => item.totalAmountImport));
                setMonthIndex(results.listTotalAndTotalAmountImport.map((item) => item.month));
            }
        }
    };
    useEffect(() => {
        getAllReport();
    }, []);
    const labels = useMemo(() => {
        const listMonths = monthIndex.map((monthIndex) => months[monthIndex]);
        return listMonths;
    }, [monthIndex]); //['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Doanh thu',
                data: allProfit,
                borderColor: '#f8a647',
                backgroundColor: '#f8a64780',
                color: 'black',
            },
            {
                fill: true,
                label: 'Phí nhập hàng',
                data: allImport,
                borderColor: '#3e72c7',
                backgroundColor: '#3e72c780',
                color: 'black',
            },
        ],
    };
    const options = {
        // responsive: true,
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
            {allProfit && <Line height={450} data={data} options={options} />}
        </div>
    );
};

export default ProfitTracker;
