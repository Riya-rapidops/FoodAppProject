import React from 'react';
import { data } from '../../../utils/data'
import CategoryItem from './CategoryItem';


const Category = () => {
  const items = data.Categories

  return (
    <section className="menu">
        <div className="text-center text-gray-800 text-4xl font-bold my-5">Categories</div>
        <div className=" my-12 px-4 md:px-28">
            <div className="flex flex-wrap menu-ipad justify-center -mx-1 lg:-mx-4">
                {
                    items?.map((item,index) => <CategoryItem key={item.id} item = {item} index={index}/>)
                }
            </div>
        </div>
    </section>
)
}

export default Category