import React from 'react'
import HeaderMain from '../components/HeaderMain'
import Footer from '../components/Footer'
import Remote from '../components/Remote'
import Ask from '../components/Ask'
const AtHousePage = () => {
    return (
        <div>
            <HeaderMain check={"tainha"} />

            <div className="w-full pt-[140px]">
                <div className="max-w-[1300px] mx-auto px-4">
                    <img
                        src="https://cdn.bookingcare.vn/fo/2023/11/02/113503-dich-vu-cham-soc-suc-khoe-tai-nha.png"
                        alt="anhminhoa"
                        className="
                rounded-3xl 
                w-full 
                object-cover 
                h-[180px]       
                sm:h-[240px]    
                md:h-[300px]    
                lg:h-[350px]    
                xl:h-[400px] 
                mt-5 lg:mt-0   
            "
                    />
                </div>
            </div>


            <Remote />
            <Ask />
            <Footer />
        </div>
    )
}

export default AtHousePage
