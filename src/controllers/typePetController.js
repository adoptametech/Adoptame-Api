import { TypePet } from '../models/Typepet.js';

export const getTypesPets = async (req, res) => {
  // #swagger.tags = ['PETS/TYPES']
  try {
    const typesPets = await TypePet.findAll();
    return res.status(200).json(typesPets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

}

export const createTypesPets = (req, res) => {
  // #swagger.tags = ['PETS/TYPES']
  return res.send('create Types Pets');
}