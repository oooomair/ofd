import ExploreRestaurants from './exploreComponents/ExploreRestaurants';
import './explore.scss';
import useFetch from '../other/useFetch'

const Explore = () => {

  const {data: restaurants, isPending, error} = useFetch(`https://ofd.up.railway.app/restaurants`)

  return <div className='explore' >
      <h1>Restaurants</h1>
      {error && <h5>error</h5>} 
      {isPending && <div className="dot-revolution"></div>} 
      {restaurants && <ExploreRestaurants restaurants={restaurants} />}
  </div>;
};

export default Explore;
