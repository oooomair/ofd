import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const SellerRestaurantFood = ({food, onDeleteFood}) => {

  const {id} = useParams()
  const [isChange, setIsChange] = useState(false)
  const [changedPrice, setChangedPrice] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    setPrice(food.price)
  }, [food])

  const onDelete = () => {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#grey',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Food Item has been deleted.',
          'success'
        )
        onDeleteFood(food._id)
        fetch(
          `https://ofd.up.railway.app/foods/${food._id}/${id}`,
          {
            method: 'DELETE'
          }
        ).then(res => {
          return res.json()
        }).then(data => {
          console.log(data);
        }).catch(err => {
          console.log(err);
        })
      }
    })
  }

  const onPriceChange = () => {

    const hmmprice = { changedPrice }

    fetch(
      `https://ofd.up.railway.app/foods/${food._id}`,
      {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hmmprice)
      }
    ).then(res => {
      return res.json()
    }).then(data => {
      console.log(data);
    }).catch(err => {
      console.log(err);
    })

    setIsChange(false)
  }

  return (
    <div className='seller-restaurant__seller-restaurant-food' >
        <h3>{food.name}</h3>
        <img src={`https://ofd.up.railway.app/foods/images/${food.image}`} alt="logo" />
        <p> price: {price} </p>
        <p> sales: {food.sales} </p>
        <button onClick={onDelete}>Remove</button>
    </div>
  )
}

export default SellerRestaurantFood