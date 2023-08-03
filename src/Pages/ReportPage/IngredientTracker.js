import styles from './ReportPage.module.scss';
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
const IngredientTracker = ({ className, date, type }) => {
    const [imports, setImports] = useState();
    const [exportsFromBH, setExportsFromBH] = useState();
    const [exports, setExports] = useState();
    const localStorageManager = LocalStorageManager.getInstance();
    const getIngredientReport = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await reportService.getIngredientReportByDate(
                date,
                token,
                type === 1 ? 'day' : type === 2 ? 'month' : 'year',
            );
            if (results) {
                setImports(results.imports);
                setExportsFromBH(results.exportsBH);
                setExports(results.exportsWithoutBH);
            }
        }
    };
    useEffect(() => {
        getIngredientReport();
    }, [date, type]);
    const labels = useMemo(() => {
        const listMonths = imports && imports.map((item, index) => item.name);
        return listMonths;
    }, [imports]); //['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Nhập hàng',
                data: imports && imports.map((item) => item.quantity),
                backgroundColor: '#3e72c780',
                color: 'black',
                fontSize: '16px',
                stack: 'Stack 1',
            },
            {
                fill: true,
                label: 'Bán hàng',
                data: exportsFromBH && exportsFromBH.map((item) => item.quantity),
                backgroundColor: '#c1e4d2',
                color: 'black',
                stack: 'Stack 0',
            },
            {
                fill: true,
                label: 'Xuất kho',
                data: exports && exports.map((item) => item.quantity),
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
                        return value + 'g';
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
            {imports && <Bar height={450} data={data} options={options} />}
        </div>
    );
};

export default IngredientTracker;
