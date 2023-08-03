import dayjs from 'dayjs';

export function priceFormat(number) {
    return (
        typeof number === 'number' &&
        number
            .toFixed(3)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    );
}
export const onlyNumber = (input) => {
    var regex = /^(\d+(\.\d*)?|)$/;
    return regex.test(input);
};
export function formatNumber(number) {
    // Kiểm tra nếu số nhỏ hơn 1000, không cần thay đổi
    if (typeof number !== 'number') {
        return NaN;
    }
    if (number < 1000) {
        return number.toString();
    }

    // Tính số chữ số và đơn vị
    var units = ['', 'tr', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];
    var digits = Math.floor(Math.log10(number));
    var unitIndex = Math.floor(digits / 3);

    // Tính giá trị mới và làm tròn
    var newValue = number / Math.pow(1000, unitIndex);
    newValue = Math.round(newValue * 100) / 100; // Làm tròn đến 1 chữ số thập phân

    return newValue.toString() + units[unitIndex];
}
export const timeGap = (date) => {
    const today = dayjs();
    const pastDate = dayjs(date);
    const timeDiff = today.diff(pastDate, 'minutes');
    if (timeDiff < 1) {
        return 'mới đây';
    } else if (timeDiff < 60) {
        return `${timeDiff} phút trước`;
    } else if (timeDiff / 60 < 24) {
        return `${Math.floor(timeDiff / 60)} giờ trước `;
    } else {
        return `${Math.floor(timeDiff / 60 / 24)} ngày trước `;
    }
};
