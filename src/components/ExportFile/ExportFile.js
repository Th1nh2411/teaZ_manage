import PropTypes from 'prop-types';
import styles from './ExportFile.module.scss';
import classNames from 'classnames/bind';
import { TiExport } from 'react-icons/ti';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Tippy from '@tippyjs/react';
const cx = classNames.bind(styles);

const ExportFile = ({ csvData, fileName = 'report', className }) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <Tippy placement="bottom" content="Xuất file">
            <div className={cx('wrapper', className)} variant="warning" onClick={(e) => exportToCSV(csvData, fileName)}>
                <TiExport />
            </div>
        </Tippy>
    );
};

export default ExportFile;
