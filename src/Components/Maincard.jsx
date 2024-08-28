import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import myname from "../assets/2.webp";
import myname2 from "../assets/1.webp";
import myname3 from "../assets/4.webp";


const nftItems = [
    { id: 1, name: "Aloe Cactus", price: "11.99", image: "https://images.unsplash.com/photo-1547517023-7ca0c162f816" },
    { id: 2, name: "Cosmic Cube", price: "15.99", image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead" },
    { id: 3, name: "Digital Wave", price: "9.99", image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853" },
    { id: 4, name: "Neon Blast", price: "12.99", image: "https://i.pinimg.com/736x/87/12/71/871271792c7c94449ea6834652872be0.jpg" },
    { id: 5, name: "Pixel Dream", price: "14.99", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e" },
    { id: 6, name: "White House", price: "14.99", image: "https://s.hdnux.com/photos/61/17/31/12908103/3/rawImage.jpg" },
    { id: 7, name: "Pixel Dream", price: "14.99", image: "https://th.bing.com/th/id/R.ff20b5ef8b0405610b226866b74b12f2?rik=eGIy74viLRY%2b%2bA&riu=http%3a%2f%2fww1.prweb.com%2fprfiles%2f2015%2f03%2f02%2f12556168%2fGeneva_Q1_Facade.jpg&ehk=JPpfgQiaCOhK7BwYU8TBB6FCKISsQc%2fvK6kd9ElEKGs%3d&risl=1&pid=ImgRaw&r=0" },
  ];
  
const Carousels = ({ heroSection }) => {
  return (
    <div className="w-full overflow-hidden">
      <Carousel
        showArrows={true}
        showStatus={false}
        interval={3000}
        dynamicHeight={false}
        autoPlay={true}
        showThumbs={false}
        infiniteLoop={true}
        showIndicators={false}
        renderThumbs={() => null} // Hide the default thumbs
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
              className="bg-gray-700 p-2 rounded-full"
            >
              <svg
                className="w-6 h-6 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
              className="bg-gray-700 p-2 rounded-full"
            >
              <svg
                className="w-6 h-6 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          )
        }
      >
        <div className="w-full">
          <img
            src={myname}
            className="object-cover rounded-lg"
            loading="lazy"
            style={{ width: "100%", height: "500px" }}
          />
        </div>
        <div className="w-full">
          <img
            src={myname2}
            className="object-cover rounded-lg"
            loading="lazy"
            style={{ width: "100%", height: "500px" }}
          />
        </div>
        <div className="w-full">
          <img
            src={myname3}
            className="object-cover rounded-lg"
            loading="lazy"
            style={{ width: "100%", height: "500px" }}
          />
        </div>

      </Carousel>
    </div>
  );
};

export default Carousels;
