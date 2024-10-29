const Product = require('../models/Product');
const auth = require("../auth");
const { verify, verifyAdmin, errorHandler } = auth;

// Toggle for console logging
const verbose = true;

module.exports.createProduct = async (req, res) => {
    const { name, description, price, imageLinks, isActive, createdOn } = req.body;

    // Logging request data if verbose is true
    if (verbose) {
        console.log('createProduct - Request Body:', req.body);
    }

    const newProduct = new Product({
        name,
        description,
        price,
        imageLinks,
        isActive,
        createdOn
    });

    try {
        const savedProduct = await newProduct.save();

        // Logging the saved product
        if (verbose) {
            console.log('createProduct - Saved Product:', savedProduct);
        }

        return res.status(201).send({
            message: 'Product created successfully',
            savedProduct
        });
    } catch (err) {
        // Logging the error
        if (verbose) {
            console.error('createProduct - Error:', err);
        }
        return errorHandler(err, req, res);
    }
};

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        // Logging the retrieved products
        if (verbose) {
            console.log('getAllProducts - Retrieved Products:', products);
        }

        return res.status(200).send(products);
    } catch (err) {
        if (verbose) {
            console.error('getAllProducts - Error:', err);
        }
        errorHandler(err, req, res);
    }
};

module.exports.getActiveProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });

        // Logging the active products
        if (verbose) {
            console.log('getActiveProducts - Active Products:', products);
        }

        return res.status(200).send(products);
    } catch (err) {
        if (verbose) {
            console.error('getActiveProducts - Error:', err);
        }
        errorHandler(err, req, res);
    }
};

module.exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        // Logging the product ID being retrieved
        if (verbose) {
            console.log('getProductById - Product ID:', id);
        }

        const product = await Product.findById(id);

        if (!product) {
            if (verbose) {
                console.warn('getProductById - Product not found:', id);
            }
            return res.status(404).send({ error: 'Product not found' });
        }

        if (verbose) {
            console.log('getProductById - Retrieved Product:', product);
        }

        return res.status(200).send(product);
    } catch (err) {
        if (verbose) {
            console.error('getProductById - Error:', err);
        }
        errorHandler(err, req, res);
    }
};

module.exports.searchByName = async (req, res) => {
    try {
        const searchName = req.body.name;

        if (verbose) {
            console.log('searchByName - Search Name:', searchName);
        }

        const products = await Product.find({
            name: { $regex: searchName, $options: 'i' }
        });

        if (verbose) {
            console.log('searchByName - Found Products:', products);
        }

        return res.status(200).send(products);
    } catch (err) {
        if (verbose) {
            console.error('searchByName - Error:', err);
        }
        errorHandler(err, req, res);
    }
};

module.exports.searchByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        if (verbose) {
            console.log('searchByPrice - Price Range:', { minPrice, maxPrice });
        }

        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        if (!products.length) {
            if (verbose) {
                console.warn('searchByPrice - No products found in price range:', { minPrice, maxPrice });
            }
            return res.status(404).send({ error: 'No products found' });
        }

        if (verbose) {
            console.log('searchByPrice - Found Products:', products);
        }

        return res.status(200).send(products);
    } catch (err) {
        if (verbose) {
            console.error('searchByPrice - Error:', err);
        }
        errorHandler(err, req, res);
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, imageLinks } = req.body;
        const productId = req.params.id;

        if (verbose) {
            console.log('updateProduct - Product ID:', productId);
            console.log('updateProduct - Update Data:', { name, description, price, imageLinks });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                price,
                imageLinks
            },
            { new: true }
        );

        if (!updatedProduct) {
            if (verbose) {
                console.warn('updateProduct - Product not found:', productId);
            }
            return res.status(404).send({
                error: 'Product not found'
            });
        }

        if (verbose) {
            console.log('updateProduct - Updated Product:', updatedProduct);
        }

        return res.status(200).send({
            success: true,
            message: 'Product updated successfully',
            products: updatedProduct
        });
    } catch (err) {
        if (verbose) {
            console.error('updateProduct - Error:', err);
        }
        errorHandler(err, req, res);
    }
};

module.exports.activateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (verbose) {
            console.log('activateProduct - Product ID:', productId);
        }

        const product = await Product.findById(productId);

        if (!product) {
            if (verbose) {
                console.warn('activateProduct - Product not found:', productId);
            }
            return res.status(404).send({
                error: 'Product not found'
            });
        }

        if (product.isActive) {
            if (verbose) {
                console.log('activateProduct - Product already active:', productId);
            }
            return res.status(200).send({
                message: 'Product is already active',
                product
            });
        }

        product.isActive = true;
        const updatedProduct = await product.save();

        if (verbose) {
            console.log('activateProduct - Product activated:', updatedProduct);
        }

        return res.status(200).send({
            success: true,
            message: 'Product activated successfully',
            activateProduct: updatedProduct
        });
    } catch (err) {
        if (verbose) {
            console.error('activateProduct - Error:', err);
        }
        errorHandler(err, req, res);
    }
};

module.exports.archiveProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (verbose) {
            console.log('archiveProduct - Product ID:', productId);
        }

        const product = await Product.findById(productId);

        if (!product) {
            if (verbose) {
                console.warn('archiveProduct - Product not found:', productId);
            }
            return res.status(404).send({
                error: 'Product not found'
            });
        }

        if (!product.isActive) {
            if (verbose) {
                console.log('archiveProduct - Product already archived:', productId);
            }
            return res.status(200).send({
                message: 'Product is already archived',
                archivedProduct: product
            });
        }

        product.isActive = false;
        const updatedProduct = await product.save();

        if (verbose) {
            console.log('archiveProduct - Product archived:', updatedProduct);
        }

        return res.status(200).send({
            success: true,
            message: 'Product archived successfully',
            archivedProduct: updatedProduct
        });
    } catch (err) {
        if (verbose) {
            console.error('archiveProduct - Error:', err);
        }
        errorHandler(err, req, res);
    }
};
