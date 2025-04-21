import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/users/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/roles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleOpen = (user) => {
        setSelectedUser(user);
        setSelectedRoles(user.roles.map(role => role._id));
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setSelectedRoles([]);
    };

    const handleRoleChange = async (roleId) => {
        try {
            const token = localStorage.getItem('token');
            const isRoleSelected = selectedRoles.includes(roleId);
            const endpoint = isRoleSelected ? 'remove' : 'assign';

            await axios.post(
                `${API_URL}/users/role/${endpoint}`,
                {
                    userId: selectedUser._id,
                    roleId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update local state
            if (isRoleSelected) {
                setSelectedRoles(selectedRoles.filter(id => id !== roleId));
            } else {
                setSelectedRoles([...selectedRoles, roleId]);
            }

            // Refresh users list
            fetchUsers();
        } catch (error) {
            console.error('Error updating user roles:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                User Management
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Roles</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {user.roles.map((role) => (
                                            <Chip
                                                key={role._id}
                                                label={role.name}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(user)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit User Roles</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                {selectedUser.name} ({selectedUser.email})
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel>Roles</InputLabel>
                                <Select
                                    multiple
                                    value={selectedRoles}
                                    label="Roles"
                                    onChange={(e) => setSelectedRoles(e.target.value)}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((roleId) => {
                                                const role = roles.find(r => r._id === roleId);
                                                return role ? (
                                                    <Chip key={roleId} label={role.name} size="small" />
                                                ) : null;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {roles.map((role) => (
                                        <MenuItem
                                            key={role._id}
                                            value={role._id}
                                            onClick={() => handleRoleChange(role._id)}
                                        >
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;