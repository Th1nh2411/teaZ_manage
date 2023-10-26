import styles from './ReportPage.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Chart, registerables } from 'chart.js';
import { formatNumber, priceFormatReport } from '../../utils/format';
import * as reportService from '../../services/reportService';
Chart.register(...registerables);

const cx = classNames.bind(styles);
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ProfitTracker = ({ className, reportData }) => {
    const labels = useMemo(() => {
        const listMonths = reportData && reportData.totalImport.map((item, index) => months[index]);
        return listMonths;
    }, [reportData]); //['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Doanh thu',
                data: reportData && reportData.totalRevenue,
                borderColor: '#f8a647',
                backgroundColor: '#f8a64780',
                color: 'black',
            },
            {
                fill: true,
                label: 'Phí nhập hàng',
                data: reportData && reportData.totalImport,
                borderColor: '#3e72c7',
                backgroundColor: '#3e72c780',
                color: 'black',
            },
            {
                fill: true,
                label: 'Tiền xuất hàng',
                data: reportData && reportData.totalExport,
                borderColor: '#da4453',
                backgroundColor: '#e67f8a',
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
                        return priceFormatReport(value);
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
            {reportData && <Line height={450} data={data} options={options} />}
        </div>
    );
};

export default ProfitTracker;
