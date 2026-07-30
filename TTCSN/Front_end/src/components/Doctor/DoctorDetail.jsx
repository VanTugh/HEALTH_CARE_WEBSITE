import React from 'react';
import DoctorInfo from './DoctorInfor';
import DoctorPackage from './DoctorPackage';
import { Link } from 'react-router-dom'
import DoctorClinicInfo from "./DoctorClinicInfo";
const DoctorDetail = ({ doctor, cosoyte }) => {

    return (
        <div className="flex border border-gray-300 rounded-lg shadow-md overflow-hidden mb-5">
            <Link
                to={`/doctor/${doctor.bacSiID}`}
                state={{ cosoyte: cosoyte }}
                className="no-underline w-1/2"
            >
                <div className="cursor-pointer">
                    <DoctorInfo doctor={doctor} />
                </div>
                <div className='ml-5'>
                    <DoctorClinicInfo doctor={doctor} cosoyte={cosoyte} />
                </div>
            </Link>
            <DoctorPackage className="w-1/2"
                doctor={doctor}
            />
        </div>
    );
};

export default DoctorDetail;
