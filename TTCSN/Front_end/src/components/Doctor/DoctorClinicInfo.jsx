import React from "react";

const DoctorClinicInfo = ({ doctor, cosoyte }) => {

    const GIA_KHAM_THEO_TRINH_DO = {
        1: 150000,
        2: 250000,
        3: 300000,
        4: 400000,
        5: 500000,
        6: 700000,
        7: 800000,
    };

    const formatCurrency = (value) => {
        if (!value) return "0";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const giaKham =
        GIA_KHAM_THEO_TRINH_DO[doctor?.trinhDoID] || doctor?.giaKham || 0;

    return (
        <div>
            <div className="mt-2 flex flex-col gap-y-1">
                <p className="font-semibold">ĐỊA CHỈ KHÁM</p>
                <p className="text-sky-700 font-bold">{cosoyte.tenCoSo}</p>
                <p className="text-[14px] font-semibold">Địa chỉ: {cosoyte.diaChi}</p>
            </div>

            <div className="mt-2">
                <p className="font-semibold text-[14px]">Giá khám:<span className="font-bold ml-2 text-[16px] text-sky-700 ">{formatCurrency(giaKham)} vnđ</span> </p>
            </div>
        </div>
    );
};

export default DoctorClinicInfo;
