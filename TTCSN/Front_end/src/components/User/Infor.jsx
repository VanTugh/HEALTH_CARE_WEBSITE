import React from 'react'

const Infor = ({ user, setIsEditing }) => {
    return (
        <div className='w-full flex flex-col gap-2 sm:gap-3'>
            <p className='bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-[4px] font-medium text-xs sm:text-sm md:text-base'>Họ và tên: {user.hoTen}</p>
            <p className='bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-[4px] font-medium text-xs sm:text-sm md:text-base'>Email: {user.email}</p>
            <p className='bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-[4px] font-medium text-xs sm:text-sm md:text-base'>Số điện thoại: {user.soDienThoai}</p>
            <p className='bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-[4px] font-medium text-xs sm:text-sm md:text-base'>Địa chỉ: {user.diaChi}</p>
            <p className='bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-[4px] font-medium text-xs sm:text-sm md:text-base'>Ngày sinh: {user.ngaySinh}</p>
            <p className='bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-[4px] font-medium text-xs sm:text-sm md:text-base'>Giới tính: {(user.gioiTinh == 1) ? "Nam" : "Nữ"}</p>
            <button
                onClick={() => setIsEditing(true)}
                className='px-4 py-2 sm:px-5 sm:py-2 cursor-pointer mr-auto bg-sky-500 hover:bg-sky-600 rounded-[8px] text-white font-medium text-xs sm:text-sm md:text-base mt-2'
            >
                Sửa thông tin
            </button>
        </div>
    )
}

export default Infor
