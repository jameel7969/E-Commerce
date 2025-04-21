const Role = require('../models/roleModel');

const createRole = async (req, res) => {
    try {
        const { name, permissions, description } = req.body;

        const roleExists = await Role.findOne({ name });
        if (roleExists) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        const role = await Role.create({
            name,
            permissions,
            description
        });

        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { name, permissions, description } = req.body;
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        role.name = name || role.name;
        role.permissions = permissions || role.permissions;
        role.description = description || role.description;

        const updatedRole = await role.save();
        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        await role.deleteOne();
        res.json({ message: 'Role removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createRole,
    getRoles,
    updateRole,
    deleteRole
};