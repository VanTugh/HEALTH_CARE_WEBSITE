import React from 'react';

const DoctorInfo = ({ doctor }) => {
    return (
        <div className="flex flex-col p-4">
            <div className="flex items-start mb-2">
                <img
                    src={doctor?.avatarUrl || "https://cdn.bookingcare.vn/fo/w640/2025/06/18/105310-gs-ha-van-quyet.png"}
                    alt={doctor?.hoTen || "Bác sĩ"}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                />

                <div>
                    <h2 className="text-xl font-bold text-sky-600">
                        Bác sĩ {doctor?.hoTen}
                    </h2>

                    <p className="text-gray-700 mb-1 text-[15px] font-medium">
                        {doctor?.tenTrinhDo}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DoctorInfo;