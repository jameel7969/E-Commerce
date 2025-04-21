import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';

const drawerWidth = 240;

const Categories = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const { user } = useSelector((state) => state.auth);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCreateCategory = () => {
        setEditCategory(null);
        setFormOpen(true);
    };

    const handleEditCategory = (category) => {
        setEditCategory(category);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditCategory(null);
    };

    const canManageCategories = user?.isAdmin || user?.roles?.some(role =>
        role.permissions.includes('manage:categories')
    );

    const drawer = (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Categories</Typography>
                {canManageCategories && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateCategory}
                        size="small"
                    >
                        Add
                    </Button>
                )}
            </Box>
            <CategoryList onEditCategory={handleEditCategory} />
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
                        Category Management
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
                    Welcome to Category Management
                </Typography>
                {/* Add additional content here if needed */}
            </Box>

            <CategoryForm
                open={formOpen}
                onClose={handleCloseForm}
                editCategory={editCategory}
            />
        </Box>
    );
};

export default Categories;