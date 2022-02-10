import Image from "next/image"


const Adverts = () => {
  return (
    <div className="container">
      <h1>Fake Ads here</h1>
      <Image
        src="https://www.designyourway.net/blog/wp-content/uploads/2010/11/Nike-Print-Ads-12.jpg"
        width="300"
        height="500"
        alt="Advert #1"
      ></Image>
      <Image
        src="https://landerapp.com/blog/wp-content/uploads/2018/08/barcadi.jpg"
        width="300"
        height="500"
        alt="Advert #2"
      ></Image>
    </div>
  );
};

export default Adverts;