import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Paper,
    Box,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchProducts, deleteProduct } from '../../redux/products/productSlice';
import { fetchCategories } from '../../redux/categories/categorySlice';
import { subscribeToChannel } from '../../services/pusherService';

const ProductList = ({ onEditProduct }) => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    const { user } = useSelector((state) => state.auth);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts(selectedCategory === 'all' ? null : selectedCategory));

        const unsubscribe = subscribeToChannel('products-channel', {
            'product-created': (newProduct) => {
                dispatch({ type: 'products/productAdded', payload: newProduct });
                setNotification({
                    open: true,
                    message: 'New product added: ' + newProduct.name,
                    severity: 'success'
                });
            },
            'product-updated': (updatedProduct) => {
                dispatch({ type: 'products/productUpdated', payload: updatedProduct });
                setNotification({
                    open: true,
                    message: 'Product updated: ' + updatedProduct.name,
                    severity: 'info'
                });
            },
            'product-deleted': (deletedProduct) => {
                dispatch({ type: 'products/productDeleted', payload: deletedProduct._id });
                setNotification({
                    open: true,
                    message: 'Product deleted',
                    severity: 'warning'
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch, selectedCategory]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category?._id === selectedCategory);

    const canManageProducts = user?.isAdmin || user?.roles?.some(role =>
        role.permissions.includes('create:product') ||
        role.permissions.includes('update:product') ||
        role.permissions.includes('delete:product')
    );

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select
                        value={selectedCategory}
                        label="Filter by Category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <List>
                    {filteredProducts.map((product) => (
                        <ListItem
                            key={product._id}
                            secondaryAction={
                                canManageProducts && (
                                    <Box>
                                        <IconButton edge="end" onClick={() => onEditProduct(product)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(product._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                )
                            }
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {product.name}
                                        <Chip
                                            label={product.category?.name || 'Uncategorized'}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                }
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                            ${product.price}
                                        </Typography>
                                        {" — "}{product.description}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProductList;