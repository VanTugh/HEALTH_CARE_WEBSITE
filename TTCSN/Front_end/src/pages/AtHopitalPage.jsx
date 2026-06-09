import React, { useState, useEffect, useRef } from 'react'
import HeaderMain from '../components/HeaderMain'
import Footer from '../components/Footer'
import ForMe from '../components/ForMe'
import Medical from '../components/Medical'
import ListDoctor from '../components/ListDoctor'
import ListSpecialty from '../components/ListSpecialty'
import Suggest from '../components/Suggest'
import d1 from "../assets/images/deal/d1.png"
import d2 from "../assets/images/deal/d2.png"
import d3 from "../assets/images/deal/d3.png"
import d4 from "../assets/images/deal/d4.png"
import d5 from "../assets/images/deal/d5.png"
import d6 from "../assets/images/deal/d6.png"
import d7 from "../assets/images/deal/d7.png"
import d8 from "../assets/images/deal/d8.png"


const AtHopitalPage = () => {
    const images = [d1, d2, d3, d4, d5, d6, d7, d8]
    const [index, setIndex] = useState(1)
    const [isTransitioning, setIsTransitioning] = useState(true)
    const timerRef = useRef(null)


    const extendedImages = [
        images[images.length - 1],
        ...images,
        images[0]
    ]

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setIndex((prev) => prev + 1)
            setIsTransitioning(true)
        }, 3000)

        return () => clearInterval(timerRef.current)
    }, [])
    useEffect(() => {
        if (index === extendedImages.length - 1) {
            setTimeout(() => {
                setIsTransitioning(false)
                setIndex(1)
            }, 500)
        }

        if (index === 0) {
            setTimeout(() => {
                setIsTransitioning(false)
                setIndex(images.length)
            }, 500)
        }
    }, [index, extendedImages.length, images.length])
    return (
        <div>
            <HeaderMain check={"taivien"} />

            <div className='w-full pt-[140px] mb-10 mt-5 lg:mt-0'>
                <div className='max-w-[1300px] mx-auto px-5 lg:px-0'>
                    <div className='relative'>

                        <div className='overflow-hidden rounded-4xl w-full h-[200px] sm:h-[250px] md:h-[400px] relative'>
                            <div
                                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                                style={{ transform: `translateX(-${index * 100}%)` }}
                                onTransitionEnd={() => setIsTransitioning(true)}
                            >
                                {extendedImages.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`deal-${i}`}
                                        className='w-full h-[200px] sm:h-[250px] md:h-[400px] object-cover flex-shrink-0'
                                    />
                                ))}
                            </div>
                        </div>


                        <div className='mt-4 flex justify-center items-center absolute -bottom-2 left-1/2 -translate-x-1/2'>
                            <div className='flex gap-6 h-[30px]'>
                                {images.map((_, i) => (
                                    <span
                                        key={i}
                                        onClick={() => setIndex(i + 1)}
                                        className={`block rounded-full bg-amber-400 transition-all duration-300 cursor-pointer ${i + 1 === index ? 'w-3.5 h-3.5' : 'w-2 h-2 opacity-50'
                                            }`}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ForMe />
            <Medical />
            <ListSpecialty />
            <ListDoctor />
            <Suggest />
            <Footer />
        </div>
    )
}

export default AtHopitalPage
