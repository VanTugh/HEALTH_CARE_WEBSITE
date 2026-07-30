import React from 'react'
import pc1 from "../assets/images/suggest/goiy1.png"
import pc2 from "../assets/images/suggest/goiy2.png"
import pc3 from "../assets/images/suggest/goiy3.png"

const Suggest = () => {
    const list = [
        { id: 1, name: "Được quan tâm", image: pc1 },
        { id: 2, name: "Y tế", image: pc2 },
        { id: 3, name: "Bài viết liên quan", image: pc3 }
    ]

    return (
        <div className='max-w-[1300px] mx-auto mt-10 pt-5 px-5 lg:px-0'>
            <h2 className='text-[24px] md:text-[28px] font-semibold mb-6'>Gợi ý của HealthCare</h2>
            <ul className='flex flex-wrap justify-start gap-12 sm:gap-12 md:gap-16'>
                {list.map((item) => (
                    <li key={item.id} className='text-center flex-none w-[160px] sm:w-[180px] md:w-[222px]'>
                        <img
                            src={item.image}
                            alt={item.name}
                            className='rounded-full w-full h-[160px] sm:h-[180px] md:h-[222px] object-cover mx-auto'
                        />
                        <h3 className='text-[14px] sm:text-[16px] md:text-[18px] font-semibold mt-3 md:mt-5'>
                            {item.name}
                        </h3>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Suggest
