import axios from "axios";
import { useEffect, useState } from "react";

const Movie = () => {
  const [data, setData] = useState([]);

  const API =
    "https://www.omdbapi.com/?i=tt3896198&apikey=1c12799f&s=titanic&page=1";

  const getMovie = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data.Search);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  return (
    <div>
      <ul className=" mt-10 container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
        {data.map((item) => (
          <div
            key={item.imdbID}
            className="max-w-sm bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:shadow-gray-700 m-4 flex flex-col"
          >
            <img
              className="rounded-xl w-full h-64 object-cover object-center"
              src={item.Poster}
              alt={item.Title}
            />
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {item.Title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-4">
                {item.Year}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Movie;
