import React, { useEffect, useState } from 'react';
import Infor from './Infor';
import InforForm from './InforForm';
import api from '../../utils/api';

const AccountInfor = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        api.get("/api/auth/me")
            .then(({ data }) => setUser(data))
            .catch(error => {
                console.error("Lỗi khi gọi API:", error);
            });
    }, []);

    if (!user) return <p>Đang tải thông tin...</p>;

    return (
        <div className='w-full border rounded-[12px] border-gray-300 shadow-md'>
            <h2 className='bg-[#70b8e8] text-white rounded-t-[12px] px-5 py-2 font-bold text-[24px]'>
                Thông tin tài khoản
            </h2>
            <div className='flex flex-col sm:flex-row px-5 gap-5 pt-2'>

                <div className='pt-5 text-center flex flex-col items-center'>
                    <img
                        className='rounded-full w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover'
                        src={user.avatarUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsCc5E-o4z6uPnn8qn_ITbrlxdJ5kdmbztmg&s"}
                        alt="avatar"
                    />
                    <p className='font-semibold mt-2 text-sm sm:text-base md:text-lg'>{user.hoTen}</p>
                </div>


                <div className='flex-1 py-5'>
                    {isEditing
                        ? <InforForm user={user} setUser={setUser} setIsEditing={setIsEditing} />
                        : <Infor user={user} setIsEditing={setIsEditing} />}
                </div>
            </div>
        </div>
    );
};

export default AccountInfor;
