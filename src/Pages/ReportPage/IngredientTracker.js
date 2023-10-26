import styles from './ReportPage.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Chart, registerables } from 'chart.js';
import { formatNumber } from '../../utils/format';
import * as reportService from '../../services/reportService';
Chart.register(...registerables);

const cx = classNames.bind(styles);
const IngredientTracker = ({ className, reportData }) => {
    const labels = useMemo(() => {
        const listLabels = reportData && reportData.map((item, index) => item.name);
        return listLabels;
    }, [reportData]); //['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Nhập hàng',
                data: reportData && reportData.map((item) => item.total_import),
                backgroundColor: '#3e72c780',
                color: 'black',
                fontSize: '16px',
                stack: 'Stack 1',
            },

            {
                fill: true,
                label: 'Xuất kho',
                data: reportData && reportData.map((item) => item.total_export),
                backgroundColor: '#d95d60',
                color: 'black',
                stack: 'Stack 0',
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
                        return value / 1000 + '(kg/l)';
                    },
                },
                grid: {
                    display: false,
                },
                stacked: true,
            },
            x: {
                stacked: true,
                ticks: { color: 'black', padding: 10, font: { size: 16 } },
                grid: {
                    display: false,
                },
            },
        },
    };
    return (
        <div className={cx('chart-wrapper', className)}>
            {reportData && <Bar height={450} data={data} options={options} />}
        </div>
    );
};

export default IngredientTracker;
