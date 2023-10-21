const express =  require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose')
const { sendSSEData } = require('../../sseConnection'); // Import the SSE module






router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});




  router.post('/', (req, res, next) => {
    const { origin, destination } = req.body;
    console.log('Received POST request with data:', req.body);
  
    if (!origin || !destination || !origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
      console.log('Origin or destination is empty.');
      return res.status(400).json({ message: 'Origin or destination is empty.' });
    }
  
    // Create a new instance of the Product model
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        origin: {
        latitude: origin.latitude,
        longitude: origin.longitude,
      },
      destination: {
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
    });
  
    // Save the product to the database
    product.save()
      .then(savedProduct => {
        console.log('Product saved:', savedProduct);
  
        sendSSEData(savedProduct);

        res.status(201).json({
          message: 'Product created successfully',
          createdProduct: savedProduct,
        });
      })
      .catch(err => {
        console.error('Error while saving product:', err);
        res.status(500).json({ error: err });
      });
  });
  

{/*setInterval(() => {
    while (newProductsQueue.length > 0) {
      // Send the newly created product data to all connected SSE clients
      sendSSEData({ type: 'new-product', data: newProductsQueue.shift() });
    }
  }, 2000);*/} // Adjust the interval as needed (e.g., 2000ms = 2 seconds)
  


router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From Database", doc);
        if (doc) {
            res.status(200).json(doc)
        } else {
            res.status(404).json({ message: 'No valid entry found for valid ID' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

// this will work if you use an array instead of a json object in the body
router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    
    // Check if req.body is an array and is not empty
    if (Array.isArray(req.body) && req.body.length > 0) {
        for (const ops of req.body) {
            if (ops.propName && ops.value) {
                updateOps[ops.propName] = ops.value;
            }
        }
    } else {
        return res.status(400).json({ message: "Invalid request body. Please provide an array of updates." });
    }

    // Check if updateOps is not empty
    if (Object.keys(updateOps).length === 0) {
        return res.status(400).json({ message: "No valid update data found in the request body." });
    }

    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount === 0) {
                res.status(404).json({ message: "No document found for the given ID." });
            } else {
                res.status(200).json(result);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete("/deleteAll", (req, res, next) => {
    Product.deleteMany({})
      .exec()
      .then(result => {
        res.status(200).json({ message: "All entries deleted successfully." });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });


module.exports = router;