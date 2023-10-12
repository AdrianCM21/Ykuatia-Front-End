import Layout from "../../components/layout/Layout"
import MapComponent from "../../components/maps/MapComponent"

const Home = () => {
    return (
        <Layout>
            <div style={{width:'200px'}}>
               <MapComponent />  
            </div>
              
        </Layout>    
    )
}

export default Home