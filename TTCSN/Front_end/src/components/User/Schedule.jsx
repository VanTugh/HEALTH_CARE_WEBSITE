import React, { useEffect, useState } from 'react'

const Schedule = () => {
    const [inforSchedule, setInforSchedule] = useState({})

    useEffect(() => {
        fetch("")

    }, [])


    return (
        <div className='border rounded-[12px] border-gray-300 shadow-md'>
            <h2 className='bg-[#70b8e8] text-white rounded-t-[12px] px-5 py-2 font-bold text-[24px]'>Lịch khám</h2>
            <div className='p-5'>
                <ul>
                    <li className='flex gap-x-5'>
                        <div>
                            <img className='size-[50px] rounded-[50%]'
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsCc5E-o4z6uPnn8qn_ITbrlxdJ5kdmbztmg&s" alt="" />
                        </div>
                        <div className='flex-1'>
                            <p className='font-medium'>Bệnh nhân: { }</p>
                            <p className='font-medium'>Bác sĩ: { }</p>
                            <p className='font-medium'>Nơi khám: { }</p>
                            <p className='font-medium'>Giờ khám: { }</p>
                            <p className='font-medium'>Ngày: { }</p>
                            <p className='font-medium'>Ghi chú: { }</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Schedule
