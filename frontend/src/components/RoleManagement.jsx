import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Chip,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { fetchRoles, createRole, updateRole, deleteRole } from '../redux/roles/rolesSlice';

const AVAILABLE_PERMISSIONS = [
    'create:product',
    'read:product',
    'update:product',
    'delete:product',
    'manage:users',
    'manage:roles',
    'manage:categories'
];

const RoleManagement = () => {
    const dispatch = useDispatch();
    const { roles, loading } = useSelector((state) => state.roles);
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: []
    });

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    const handleOpen = (role = null) => {
        if (role) {
            setSelectedRole(role);
            setFormData({
                name: role.name,
                description: role.description || '',
                permissions: role.permissions
            });
        } else {
            setSelectedRole(null);
            setFormData({
                name: '',
                description: '',
                permissions: []
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRole(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedRole) {
            dispatch(updateRole({ id: selectedRole._id, roleData: formData }));
        } else {
            dispatch(createRole(formData));
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            dispatch(deleteRole(id));
        }
    };

    const togglePermission = (permission) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Role Management</Typography>
                <Button variant="contained" onClick={() => handleOpen()}>
                    Create New Role
                </Button>
            </Box>

            <List>
                {roles.map((role) => (
                    <Paper key={role._id} sx={{ mb: 1, p: 2 }}>
                        <ListItem
                            secondaryAction={
                                <>
                                    <IconButton edge="end" onClick={() => handleOpen(role)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDelete(role._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={role.name}
                                secondary={
                                    <Box sx={{ mt: 1 }}>
                                        {role.description && (
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {role.description}
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {role.permissions.map((permission) => (
                                                <Chip key={permission} label={permission} size="small" />
                                            ))}
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Role Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            margin="normal"
                            multiline
                            rows={2}
                        />
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            Permissions
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {AVAILABLE_PERMISSIONS.map((permission) => (
                                <Chip
                                    key={permission}
                                    label={permission}
                                    onClick={() => togglePermission(permission)}
                                    color={formData.permissions.includes(permission) ? 'primary' : 'default'}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedRole ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default RoleManagement;