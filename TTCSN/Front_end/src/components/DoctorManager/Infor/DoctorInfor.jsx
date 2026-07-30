import React, { useEffect, useState } from 'react';
import Infor from './Infor';
import InforForm from './InforForm';


const DoctorInfor = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const specialties = [
        { id: 1, name: "Cơ xương khớp" },
        { id: 2, name: "Thần kinh" },
        { id: 3, name: "Tiêu hóa" },
        { id: 4, name: "Tim mạch" },
        { id: 5, name: "Tai Mũi Họng" },
        { id: 6, name: "Cột sống" },
    ];

    const degrees = [
        { id: 1, name: "Đa khoa" },
        { id: 2, name: "CKI" },
        { id: 3, name: "CKII" },
        { id: 4, name: "Tiến sĩ" },
        { id: 5, name: "Phó Giáo sư" },
        { id: 6, name: "Giáo Sư" },
        { id: 7, name: "Chuyên gia đầu ngành" },
    ];

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            console.error("Không tìm thấy dữ liệu user trong localStorage.");
            return;
        }
        const userObject = JSON.parse(userJson);
        const userID = userObject.nguoiDungID;
        if (!userID) {
            console.error("Không tìm thấy ID trong đối tượng user.");
            return;
        }
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_BASE_URL}/api/doctors/${userID}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Lỗi lấy dữ liệu");
                return response.json();
            })
            .then(data => {
                setUser(data);
                console.log(data)
            })
            .catch(error => {
                console.error("Lỗi khi gọi API:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            });
    }, []);

    if (!user) return <p>Đang tải thông tin...</p>;

    return (
        <div className='w-full border rounded-[12px] border-gray-300 shadow-md'>
            <h2 className='bg-[#70b8e8] text-white rounded-t-[12px] px-5 py-2 font-bold text-[24px]'>
                Thông tin tài khoản
            </h2>
            <div className='flex px-5 gap-x-5 pt-2'>
                <div className='pt-5 text-center flex flex-col items-center'>
                    <img
                        className='rounded-[50%] size-[120px]'
                        src={user.avatarUrl}
                        alt="avatar"
                    />
                    <p className='font-semibold mt-2'>{user.hoTen}</p>
                </div>
                <div className='flex-1 py-5 ml-5'>
                    {isEditing
                        ? <InforForm
                            user={user}
                            setUser={setUser}
                            setIsEditing={setIsEditing}
                            specialties={specialties}
                            degrees={degrees}
                        />
                        : <Infor user={user} setIsEditing={setIsEditing} />}
                </div>
            </div>
        </div>
    );
};

export default DoctorInfor;
