const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Food = require('../models/food')
const Restaurant = require('../models/restaurant')
const multer = require('multer')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const { uploadFile, getFileStream } = require('../s3')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('only jpegs and pngs allowed'), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

// get food image

router.get('/images/:key', (req, res) => {
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

// create 

router.post('/:restaurantId', upload.single('image'), async (req, res) => {

    const { name, price } = req.body

    if (!req.file) {
      return res.status(401).json({
        message: 'Logo not found'
      })
    } else {
      const newFood = new Food({
        _id: mongoose.Types.ObjectId(),
        name: name,
        image: req.file.filename,
        price: price,
        restaurant: req.params.restaurantId
    })

    await uploadFile(req.file)
    await unlinkFile(req.file.path)

    
    const foundRestaurant = await Restaurant.findById(req.params.restaurantId)
    await foundRestaurant.foods.push(newFood._id)

    try {
        await newFood.save()
        await foundRestaurant.save()
        res.status(201).json({
          status: 200
        })
    } catch (err) {
        res.status(400).json({message: 'Check Inputs'})
    }
  }

})

// update 

router.patch('/:id', (req, res) => {

  Food.findByIdAndUpdate(req.params.id, {price: req.body.changedPrice}, {new: true}).then((food) => {
      if (!food) {
          return res.status(404).json({
              message: 'food not found'
          });
      }
      res.status(200).json({
          message: 'price updated'
      })
  }).catch((error) => {
      res.status(500).send(error);
  })
})

// delete 

router.delete('/:id/:restaurantId', getFood, async (req, res) => {

    const foundRestaurant = await Restaurant.findById(req.params.restaurantId)

    const index = foundRestaurant.foods.findIndex(food => food.toString() === req.params.id);

    if (index !== -1) {
        foundRestaurant.foods.splice(index, 1)
    }

    try {
        await foundRestaurant.save()
        await res.food.remove()
        res.status(200).json({ message: 'successfully deleted the food' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// get one middleware

async function getFood(req, res, next) {
    let food
    try {
        food = await Food.findById(req.params.id)
        if (food === null) {
          return res.status(404).json({ message: 'cannot find resturant' })
        }
    } catch (err) {
       return res.status(500).json({ message: err.message })
    }

    res.food = food
    next()
}


module.exports = router