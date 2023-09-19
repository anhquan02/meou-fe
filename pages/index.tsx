import { Carousel, IconButton } from "@material-tailwind/react";
import type { NextPage } from "next";
import UnderlineLink from "../components/underline-link";
import { Fragment, useCallback, useEffect, useState } from "react";
import Fetch from "../services/Fetch";
import CardProduct from "../components/Card";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../services/firebase";
const Home: NextPage = () => {
  const [data, setData] = useState<any[]>([]);

  const handleDownloadImage = async (image: any) => {
    if (!image) return "";
    const imageRef = ref(storage, `images/${image}`);
    const url = await getDownloadURL(imageRef)
      .then((url) => {
        return url;
      })
      .catch((error) => {
        console.log(error);
      });
    return url;
  };

  useEffect(() => {
    (async () => {
      await Fetch.post("/api/v1/customer/home")
        .then(async (res: any) => {
          if (res.data.code == 200) {
            const _data = res.data.data.content;
            _data.map(async (item: any) => {
              if (!item.image)
                item.imageURL = "/nike-air-force-1-shadow-all-white.jpg";
              else item.imageURL = await handleDownloadImage(item.image);
            });
            setData(_data);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    })();
  }, []);

  const renderProduct = useCallback(() => {
    if (data.length == 0) return;
    return (
      <>
        {data.map((item: any, index) => {
          if (index > 2) return;
          return (
            <CardProduct key={item.id} product={item} image={item.imageURL} />
          );
        })}
      </>
    );
  }, [data]);

  return (
    <div className="mx-auto max-w-screen-xl p-2 lg:rounded-full">
      <Carousel
        transition={{ duration: 2 }}
        className="rounded-xl h-96 items-center"
        autoplay
        loop
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "w-8 bg-black" : "w-4 bg-black/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
        prevArrow={({ handlePrev }) => (
          <IconButton
            variant="text"
            color="gray"
            size="lg"
            onClick={handlePrev}
            className="!absolute top-2/4 left-4 -translate-y-2/4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            variant="text"
            color="gray"
            size="lg"
            onClick={handleNext}
            className="!absolute top-2/4 !right-4 -translate-y-2/4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </IconButton>
        )}
      >
        <img
          src="https://img.muji.net/img/item/4550344414453_1260.jpg"
          alt="image 1"
          className="h-full object-cover mx-auto"
        />
        <img
          src="https://vn-test-11.slatic.net/p/99d3086c1d0270244ce552cf48aa7977.jpg"
          alt="image 2"
          className="h-full object-cover mx-auto"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHf-akg0_6XJJWzbWlveTdUdUUuAX-HNMeg&usqp=CAU"
          alt="image 3"
          className="h-full object-cover mx-auto"
        />
      </Carousel>
      <div className="flex flex-col items-center text-center my-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Sản phẩm gần đây
        </span>
        <p className="text-2xl-regular text-gray-900 max-w-lg mb-4">
          Những sản phẩm mới nhất của chúng tôi sẽ mang lại cho bạn những trải
          nghiệm tuyệt vời nhất
        </p>
        <UnderlineLink href="/store">Khám phá thêm</UnderlineLink>
      </div>
      <div className="grid grid-cols-3 gap-4">{renderProduct()}</div>
    </div>
  );
};

export default Home;
