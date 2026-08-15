import React, { useState } from 'react'
import HeaderSub from "../HeaderSub"
import Footer from '../Footer'
import { Link } from 'react-router-dom'
import AccountInfor from './AccountInfor'
import ChangePassword from './ChangePassword'
import Schedule from './Schedule'
const AccountUser = () => {
    const [indexPage, setIndexPage] = useState(0)
    return (
        <>
            <HeaderSub />
            <div className='max-w-[1300px] mx-auto mt-[120px] flex gap-5'>
                <div className='w-[20%] flex flex-col gap-y-2 border-r pr-0.5 border-gray-200'>
                    <Link className={`${indexPage == 0 ? "border-sky-500 bg-[#f2edea] text-sky-800" : "border-gray-400"} py-3 px-4 border-l-4 hover:bg-gray-100 rounded-[4px] font-medium`}
                        onClick={() => setIndexPage(0)}>Thông tin tài khoản</Link>
                    <Link className={`${indexPage == 1 ? "border-sky-500 bg-[#f2edea] text-sky-800" : "border-gray-400"} py-3 px-4 border-l-4 hover:bg-gray-100 rounded-[4px] font-medium`}
                        onClick={() => setIndexPage(1)}>Lịch khám của bạn</Link>
                    <Link className={`${indexPage == 2 ? "border-sky-500 bg-[#f2edea] text-sky-800" : "border-gray-400"} py-3 px-4 border-l-4 hover:bg-gray-100 rounded-[4px] font-medium`}
                        onClick={() => setIndexPage(2)}>Đổi mật khẩu</Link>
                </div>
                <div className='w-[80%]'>
                    {indexPage == 0 && <AccountInfor />}
                    {indexPage == 1 && <Schedule />}
                    {indexPage == 2 && <ChangePassword />}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AccountUser
