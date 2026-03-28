// App.js
import About from "./components/about";
import Blogs from "./components/blogs";
import Category from "./components/category";
import Footer from "./components/footer";
import Header from "./components/header";
import Navbar from "./components/navbar";
import Products from "./components/products";
import ZoomWrapper from "./ZoomWrapper";
import EditAdmin from "./admin";

const App = () => {
  return (
    < div className="AdminOn">
        <Navbar />
        {/* <EditAdmin/> */}

        <Header />
        {/* <EditAdmin/> */}

        <ZoomWrapper>
        <About />
        </ZoomWrapper>
        {/* <EditAdmin/> */}


        
       
        <Category />
        {/* <EditAdmin/> */}
      

        <ZoomWrapper>
        <Products />
        </ZoomWrapper>
        {/* <EditAdmin/> */}

        <ZoomWrapper>
        <Blogs />
        </ZoomWrapper>
        {/* <EditAdmin/> */}

      
        <Footer />
        {/* <EditAdmin/> */}
    </div>
  );
};

export default App;