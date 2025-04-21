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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCategories, deleteCategory } from '../../redux/categories/categorySlice';
import { fetchProducts } from '../../redux/products/productSlice';
import { subscribeToChannel } from '../../services/pusherService';

const CategoryList = ({ onEditCategory }) => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);
    const { products } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());

        // Subscribe to Pusher events for real-time updates
        const unsubscribe = subscribeToChannel('categories-channel', {
            'category-created': (newCategory) => {
                dispatch({ type: 'categories/categoryAdded', payload: newCategory });
                setNotification({
                    open: true,
                    message: 'New category added: ' + newCategory.name,
                    severity: 'success'
                });
            },
            'category-updated': (updatedCategory) => {
                dispatch({ type: 'categories/categoryUpdated', payload: updatedCategory });
                setNotification({
                    open: true,
                    message: 'Category updated: ' + updatedCategory.name,
                    severity: 'info'
                });
            },
            'category-deleted': (deletedCategory) => {
                dispatch({ type: 'categories/categoryDeleted', payload: deletedCategory._id });
                setNotification({
                    open: true,
                    message: 'Category deleted',
                    severity: 'warning'
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            setNotification({
                open: true,
                message: error,
                severity: 'error'
            });
        }
    }, [error]);

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this category?')) {
                const result = await dispatch(deleteCategory(id)).unwrap();
                if (!result._id) {
                    setNotification({
                        open: true,
                        message: 'Failed to delete category',
                        severity: 'error'
                    });
                }
            }
        } catch (err) {
            setNotification({
                open: true,
                message: err.message || 'Failed to delete category',
                severity: 'error'
            });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    const canManageCategories = user?.isAdmin || user?.roles?.some(role =>
        role.permissions.includes('manage:categories')
    );

    const getProductCount = (categoryId) => {
        return products.filter(product => product.category?._id === categoryId).length;
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <List>
                    {categories.map((category) => (
                        <ListItem
                            key={category._id}
                            secondaryAction={
                                canManageCategories && (
                                    <Box>
                                        <IconButton edge="end" onClick={() => onEditCategory(category)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(category._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                )
                            }
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {category.name}
                                        <Chip
                                            label={category.isActive ? 'Active' : 'Inactive'}
                                            color={category.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                        <Chip
                                            label={`${getProductCount(category._id)} products`}
                                            color="primary"
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                }
                                secondary={category.description}
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

export default CategoryList;