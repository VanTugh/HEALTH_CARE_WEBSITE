import React from 'react'
import { Link } from 'react-router-dom'
import pc1 from "../assets/images/suggest/goiy1.png"
import pc2 from "../assets/images/suggest/goiy2.png"
import pc3 from "../assets/images/suggest/goiy3.png"

const Suggest = () => {
    const list = [
        { id: 1, name: "Được quan tâm", image: pc1, linkName: "Được quan tâm" },
        { id: 2, name: "Y tế", image: pc2, linkName: "Y tế" },
        { id: 3, name: "Bài viết liên quan", image: pc3, linkName: "Bài viết liên quan" }
    ]

    return (
        <div className='max-w-[1300px] mx-auto mt-10 pt-5 px-5 lg:px-0'>
            <h2 className='text-[24px] md:text-[28px] font-semibold mb-6'>Gợi ý của HealthCare</h2>
            <ul className='flex flex-wrap justify-start gap-12 sm:gap-12 md:gap-16'>
                {list.map((item) => (
                    <li key={item.id} className='text-center flex-none w-[160px] sm:w-[180px] md:w-[222px]'>
                        <Link to={`/category/${item.linkName}`} className="block transform hover:scale-105 transition-transform duration-300">
                            <img
                                src={item.image}
                                alt={item.name}
                                className='rounded-full w-full h-[160px] sm:h-[180px] md:h-[222px] object-cover mx-auto shadow-md border-4 border-transparent hover:border-[#a35a37]'
                            />
                            <h3 className='text-[14px] sm:text-[16px] md:text-[18px] font-semibold mt-3 md:mt-5 text-gray-800 hover:text-[#a35a37]'>
                                {item.name}
                            </h3>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Suggest
