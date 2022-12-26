import React, { useContext } from "react";

const CategoryItem = ({ item, index }) => {
  const backgroundColor = ["#b2e4f0", "#FFB7B2", "#c1f0b2", "#fdd97c", "#d6b2f0"];

  return (
    <div className="card-ipad w-full md:w-1/2 lg:my-4 md:mx-2 lg:w-1/6">
      <article onClick={() => { console.log(item);}}
        className="hover overflow-hidden rounded-lg shadow-lg p-2"
        style={{ backgroundColor: backgroundColor[index] }}
      >
        <img alt={item.title} className="block h-auto" src={item.image} />
        <header className="flex items-center flexible justify-center leading-tight p-1 md:p-3">
          <h1 className="text-lg">{item.name}</h1>
        </header>
      </article>
    </div>
  );
};
export default React.memo(CategoryItem);
