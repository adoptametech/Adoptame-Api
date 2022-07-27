import { Pets } from '../../models/Pets.js';
import { User } from '../../models/User.js';
import { TypePet } from '../../models/Typepet.js';
import { BreedPet } from '../../models/Breedpet.js';
import { City } from '../../models/City.js';
import { Country } from '../../models/Country.js';
import { ColorPet } from '../../models/Colorpet.js';

const removePropertiesFrom = (object) => {
  delete object["user.id"];
  delete object["user.name"];
  delete object["user.email"];
  delete object["user.phone"];
  delete object["user.lastName"];
  delete object["user.password"];
  delete object["user.address"];
  delete object["user.photo"];
  delete object["user.starts"];
  delete object["user.comentario"];
  delete object["user.points"];

  delete object["user.cityId"];
  delete object["user.city.name"];
  delete object["user.city.id"];
  delete object["user.city.countryId"];

  delete object["user.country.id"];
  delete object["user.country.name"];
  delete object["user.country.currency"];
  delete object["user.country.symbol"];

  delete object["user.countryId"];
  delete object["user.role"];
  delete object["user.active"];
  delete object["user.verification"];
  delete object["user.donaciones"];
  delete object["user.document"];

  delete object["colorpet.nameColor"];
  delete object["typepet.nameType"];
  delete object["breedpet.nameBreed"];
  delete object["colorId"];
}

export const findAllPets = async () => {
  const pets = await Pets.findAll({
    attributes: { exclude: ['breedId', 'typeId'] },
    include: [
      {
        model: ColorPet,
        attributes: ['nameColor'],
      },
      {
        model: TypePet,
        attributes: ['nameType'],
      },
      {
        model: BreedPet,
        attributes: ['nameBreed'],
      },
      {
        model: User,
        // attributes: ['address'],
        include: [
          {
            model: Country,
          },
          {
            model: City,
            // attributes: ['name'],
          }
        ]
      }
    ],
    where: {
      status: 'adoptable' || 'adoptado'
    },
    raw: true,
  });

  const responsePets = pets.map((pet) => {

    // renombrar Propiedades
    pet['type'] = pet["typepet.nameType"];
    pet['breed'] = pet["breedpet.nameBreed"];
    pet['color'] = pet["colorpet.nameColor"];
    pet['role'] = pet["user.role"];

    // formatear valores de propiedades
    pet.status_changed_at = Number(new Date(pet["published_at"])); // EPOCH format
    pet.environment = JSON.parse(pet.environment)
    pet.attributes = JSON.parse(pet.attributes)
    pet.photos = pet.photos.map((photo) => {
      return {
        option_1: photo,
        option_2: photo,
        option_3: photo,
      }
    })

    // nuevas propiedades
    pet.contact = {
      name: pet["user.name"],
      email: pet["user.email"],
      phone: pet["user.phone"],
      currency: pet["user.country.currency"],
      address: {
        address: pet["user.address"],
        city: pet["user.city.name"],
        state: pet["user.state.name"] || null,
        postcode: pet["user.city.postcode"] || null,
        country: pet["user.countryId"],
      }
    }
    // remover propiedades innesesarias
    removePropertiesFrom(pet)
    return pet
  });
  return responsePets;
}

export const findByUser = async (userId) => {
  const allPets = await findAllPets();
  const petsByUserId = allPets.filter(pet => pet.userId == userId);
  return petsByUserId
}

export const findByPkPets = async (petId) => {
  const allPets = await findAllPets();
  const petById = allPets.find(pet => pet.id == petId);
  return petById
}

export const findByFoundation = async () => {
  const allPets = await findAllPets();
  const petsByFoundations = allPets.filter(pet => pet.role === "fundation");
  return petsByFoundations
}