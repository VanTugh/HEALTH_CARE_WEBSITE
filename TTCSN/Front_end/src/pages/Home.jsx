import React from 'react'
import HeaderMain from '../components/HeaderMain'
import Footer from '../components/Footer'
import Search from '../components/Search'
import ForMe from '../components/ForMe'
import Service from '../components/Service'
import ListSpecialty from '../components/ListSpecialty'
import Medical from '../components/Medical'
import Deal from '../components/Deal'
import ListDoctor from '../components/ListDoctor'
import Remote from '../components/Remote'
import Suggest from '../components/Suggest'
import HealthPackageList from '../components/HealthPackageList'
import AIChatBot from "../components/AIChatBot"

const Home = () => {
    return (
        <div className=''>
            <HeaderMain check={"tatca"} />
            <Search />
            <ForMe />
            <Service />
            <ListSpecialty />
            <Medical />
            <Deal />
            <ListDoctor />
            <Remote />
            <Suggest />
            <Footer />

            <AIChatBot />
        </div>
    )
}

export default Home
