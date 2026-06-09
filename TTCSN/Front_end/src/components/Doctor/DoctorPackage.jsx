import React from "react";
import DoctorSchedule from "./DoctorSchedule";
import DoctorClinicInfo from "./DoctorClinicInfo";

const DoctorPackage = ({ doctor }) => {
    console.log(doctor)
    return (
        <div className="flex flex-col w-1/2 p-4 border-l border-gray-200">
            <DoctorSchedule doctor={doctor} />
        </div>
    );
};

export default DoctorPackage;
