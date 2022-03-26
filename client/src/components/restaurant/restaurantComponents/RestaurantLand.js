import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../other/useFetch'

const RestaurantLand = () => {

  const {id} = useParams()
  const {data: restaurant, isPending, error} = useFetch(`http://localhost:5000/restaurants/${id}`)

  return <div className='restaurant__restaurant-land' >
      {error && <h5>error</h5>} 
      {isPending && <div className="dot-revolution"></div>} 
      {restaurant && <div className="restaurant__stuff">
        <div className="restaurant__logo">
            <img src={`http://localhost:5000/${restaurant.logo}`} alt="" />
        </div>
        <div className="restaurant__info">
            <h1> {restaurant.name} </h1>
            <img src={`http://localhost:5000/${restaurant.logo}`} alt="" />
            <span> {restaurant.slogan} </span>
            <p> {restaurant.type} </p>
            <p> {restaurant.cities} </p>
        </div>
      </div>}
  </div>
};

export default RestaurantLand;