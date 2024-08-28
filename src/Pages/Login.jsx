import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const Nextpage = () => {
    navigate("/Marketplace");
  };
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: (dots) => (
      <div style={{ bottom: "-30px" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };
  useEffect(() => {
    console.log("Render");
  }, []);

  const images = [
    "https://www.thewowstyle.com/wp-content/uploads/2015/01/house-architecture-photography-hd-wallpaper-1920x1200-9237.jpg",
    "https://www.thewowstyle.com/wp-content/uploads/2015/01/50bd3b7bb3fc4b60b100011c_house-m-monovolume-architecture-design_haus_mayer_05.jpg",
    "https://www.thewowstyle.com/wp-content/uploads/2015/01/50bd3b43b3fc4b60b100011b_house-m-monovolume-architecture-design_haus_mayer_04.jpg",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex">
        {/* Left Column - Login Form */}
        <div className="w-1/2 p-4 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                navigate("/Marketplace");
              }}
            >
              Login
            </button>
          </form>
          {/* Added text below the login button */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:text-blue-700">
                Sign up
              </a>
            </span>
          </div>
        </div>

        {/* Right Column - Slider with Pictures */}
        <div className="w-1/2 p-4 flex flex-col justify-between">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <Slider {...sliderSettings}>
              {images.map((image, index) => (
                <div key={index} className="w-full h-80">
                  <img
                    src={image}
                    alt={`Slide ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
