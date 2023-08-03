import styles from './AdminReportPage.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Chart, registerables } from 'chart.js';
import { formatNumber } from '../../utils/format';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as reportService from '../../services/reportService';
Chart.register(...registerables);

const cx = classNames.bind(styles);
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ProfitTracker = ({ chartData, className }) => {
    const allImport = chartData ? chartData.map((month) => month.totalAmountImport) : [];
    const allProfit = chartData ? chartData.map((month) => month.total) : [];
    const labels = chartData ? chartData.map((month) => months[month.month]) : []; //['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Doanh thu',
                data: allProfit,
                // borderColor: '#f8a647',
                // backgroundColor: '#f8a64780',
                color: 'black',
            },
            {
                fill: true,
                label: 'Phí nhập hàng',
                data: allImport,
                // borderColor: '#3e72c7',
                // backgroundColor: '#3e72c780',
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
            {allProfit && <Bar height={450} data={data} options={options} />}
        </div>
    );
};

export default ProfitTracker;
