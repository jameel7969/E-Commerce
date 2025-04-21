import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { fetchCategories } from '../../redux/categories/categorySlice';

const drawerWidth = 240;

const Products = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { categories } = useSelector((state) => state.categories);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCreateProduct = () => {
        setEditProduct(null);
        setFormOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditProduct(null);
    };

    const canCreateProduct = user?.isAdmin || user?.roles?.some(role =>
        role.permissions.includes('create:product')
    );

    const getProductCountByCategory = (categoryId) => {
        return products.filter(product => product.category?._id === categoryId).length;
    };

    const drawer = (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Products</Typography>
                {canCreateProduct && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateProduct}
                        size="small"
                    >
                        Add
                    </Button>
                )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                Categories
            </Typography>
            <List>
                {categories.map((category) => (
                    <ListItem key={category._id} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <CategoryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {category.name}
                                    <Chip
                                        label={getProductCountByCategory(category._id)}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <ProductList onEditProduct={handleEditProduct} />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        E-Commerce Products
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better mobile performance
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: ['56px', '64px'],
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Welcome to Products Management
                </Typography>
            </Box>

            <ProductForm
                open={formOpen}
                onClose={handleCloseForm}
                editProduct={editProduct}
            />
        </Box>
    );
};

export default Products;