import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { createCategory, updateCategory } from '../../redux/categories/categorySlice';

const CategoryForm = ({ open, onClose, editCategory = null }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
    });

    useEffect(() => {
        if (editCategory) {
            setFormData({
                name: editCategory.name,
                description: editCategory.description || '',
                isActive: editCategory.isActive,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                isActive: true,
            });
        }
    }, [editCategory]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isActive' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editCategory) {
            await dispatch(updateCategory({ id: editCategory._id, categoryData: formData }));
        } else {
            await dispatch(createCategory(formData));
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Category Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={handleChange}
                                name="isActive"
                                color="primary"
                            />
                        }
                        label="Active"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {editCategory ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CategoryForm;