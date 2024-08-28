import React from "react";
import Bottombar from "../Components/Bottombar";
import Navbar from "../Components/Navbar";
import { TokenClass } from "../EthersClasses/Token";

const Dashboard = () => {
  const cards = [
    {
      id: 1,
      location: "Villa",
      rating: 5.0,
      imageUrl:
        "https://photos.zillowstatic.com/fp/57cef35bd4aeea30ad40c455751b1fe8-cc_ft_960.jpg",
      //   added: "Added X weeks ago",
      //   dateRange: "Date Range - Owner",
      price: "2ETH",
    },
    {
      id: 2,
      location: "Locatory",
      rating: 4.8,
      imageUrl:
        "https://th.bing.com/th/id/OIP.Nn_KmtCIf1v4vBtGkMFSBwHaE8?w=640&h=427&rs=1&pid=ImgDetMain",
      //   added: "Added Y weeks ago",
      //   dateRange: "Date Range - Owner",
      price: "0.025ETH",
    },
    {
      id: 3,
      location: "Matery",
      rating: 4.9,
      imageUrl:
        "https://a0.muscache.com/im/pictures/prohost-api/Hosting-51701996/original/ac2eabbe-da86-4646-a7d7-f6fe48c083b8.jpeg?im_w=720",
      //   added: "Added Z weeks ago",
      //   dateRange: "Date Range - Owner",
      price: "5ETH",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-w-screen min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="block rounded-lg shadow-lg bg-white w-full"
            >
              <div className="relative overflow-hidden bg-cover bg-no-repeat">
                <img
                  className="rounded-t-lg h-64 w-full object-cover"
                  src={card.imageUrl}
                  alt={card.location}
                />
                <a href="#!">
                  <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                </a>
              </div>
              <div className="p-4">
                <div className="flex justify-between">
                  <h5 className="text-sm font-bold text-neutral-800">
                    {card.location}
                  </h5>
                  <h5 className="text-sm font-bold text-neutral-800 flex items-center">
                    {card.rating}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </h5>
                </div>
                {/* <p className="text-sm text-neutral-600"> */}
                {/* {card.added} */}
                {/* </p> */}
                {/* <p cl25ETHase text-neutral-600">
                {card.dateRange}
              </p> */}
                <h5 className="text-sm font-bold text-neutral-800">
                  {card.price}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Bottombar />
    </>
  );
};

export default Dashboard;
