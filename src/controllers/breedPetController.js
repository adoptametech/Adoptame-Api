import { BreedPet } from '../models/Breedpet.js';

export const getBreedPets = async (req, res) => {
  // #swagger.tags = ['PETS/BREEDS']
  const breedPets = await BreedPet.findAll();
  return res.status(200).json(breedPets);
}

export const getBreedPetsByType = async (req, res) => {
  // #swagger.tags = ['PETS/BREEDS']
  try {
    const { type } = req.params;
    const breedPets = await BreedPet.findAll({
      where: {
        typeId: type
      }
    });
    return res.status(200).json(breedPets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export const createBreedPets = (req, res) => {
  // #swagger.tags = ['PETS/BREEDS']
  return res.send('create Breed Pets');
}