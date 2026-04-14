// // App.js
// import About from "./components/about";
// import Blogs from "./components/blogs";
// import Category from "./components/category";
// import Footer from "./components/footer";
// import Header from "./components/header";
// import Navbar from "./components/navbar";
// import Products from "./components/products";
// import ZoomWrapper from "./ZoomWrapper";
// import EditAdmin from "./admin";

// const App = () => {
//   return (
//     < div className="AdminOn">
//         <Navbar />
//         {/* <EditAdmin/> */}

//         <Header />
//         {/* <EditAdmin/> */}

//         <ZoomWrapper>
//         <About />
//         </ZoomWrapper>
//         {/* <EditAdmin/> */}


        
       
//         <Category />
//         {/* <EditAdmin/> */}
      

//         <ZoomWrapper>
//         <Products />
//         </ZoomWrapper>
//         {/* <EditAdmin/> */}

//         <ZoomWrapper>
//         <Blogs />
//         </ZoomWrapper>
//         {/* <EditAdmin/> */}

      
//         <Footer />
//         {/* <EditAdmin/> */}
//     </div>
//   );
// };

// export default App;



// App.js
import { useEffect, useState } from "react";
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
  const [isZoomRange, setIsZoomRange] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsZoomRange(width <= 1400 && width >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="AdminOn">
      {isZoomRange ? (
        <>
          <ZoomWrapper>
            <Navbar />
          </ZoomWrapper>

          <Header />

          <ZoomWrapper>
            <ZoomWrapper>
              <About />
            </ZoomWrapper>
          </ZoomWrapper>

          <ZoomWrapper>
            <Category />
          </ZoomWrapper>

          <ZoomWrapper>
            <ZoomWrapper>
              <Products />
            </ZoomWrapper>
          </ZoomWrapper>

          <ZoomWrapper>
            <ZoomWrapper>
              <Blogs />
            </ZoomWrapper>
          </ZoomWrapper>

          <ZoomWrapper>
            <Footer />
          </ZoomWrapper>
        </>
      ) : (
        <>
          <Navbar />

          <Header />

          <ZoomWrapper>
            <About />
          </ZoomWrapper>

          <Category />

          <ZoomWrapper>
            <Products />
          </ZoomWrapper>

          <ZoomWrapper>
            <Blogs />
          </ZoomWrapper>

          <Footer />
        </>
      )}
      {/* <EditAdmin/> */}
    </div>
  );
};

export default App;