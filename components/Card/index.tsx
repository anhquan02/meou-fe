import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import convertMoney from "../../services/Utils";
import { useRouter } from "next/router";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../services/firebase";

const CardProduct = ({ product }: any) => {
  const [productState, setProductState] = useState<any>({});
  const router = useRouter();

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
      const _product = product;
      if (_product.minPrice == _product.maxPrice) {
        _product.price = _product.minPrice;
      } else {
        _product.price =
          convertMoney(_product.minPrice) +
          " ~ " +
          convertMoney(_product.maxPrice);
      }
      if (!_product.image)
        _product.image = "/nike-air-force-1-shadow-all-white.jpg";
      else {
        _product.imageURL = await handleDownloadImage(_product.image);
      }
      setProductState(_product);
    })();
  }, [product]);

  return (
    <>
      <Card className="mt-6 w-96">
        <CardHeader color="transparent" className="relative h-56">
          <img
            src={
              productState?.imageURL
              // || "/nike-air-force-1-shadow-all-white.jpg"
            }
            alt="card-image"
            className="mx-auto h-full rounded-xl"
          />
        </CardHeader>
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {productState?.name || ""}
          </Typography>
          <Typography>
            {(productState.price && convertMoney(productState.price)) ||
              "Liên hệ"}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0">
          <Button onClick={() => router.push(`/product/${productState.id}`)}>
            Chi tiết
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CardProduct;
