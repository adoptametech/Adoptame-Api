import { faker } from '@faker-js/faker';
import pets from '../database/pets.js';

export const generateDataPets = async (results, ids) => {

  let data = [];

  const petsGenerated = async () => {
    let names = {
      gato: {
        macho: [
          "Alex",
          "Charlie",
          "Coco",
          "Cosmo",
          "Felix",
          "Figaro",
          "Fluffy",
          "Gatsby",
          "Harry",
          "Jack",
          "Jasper",
          "Julius",
          "Leo",
          "Lucky",
          "Luigi",
          "Max"
        ],
        hembra: [
          "Alice",
          "Bella",
          "Briciola",
          "Chloe",
          "Daisy",
          "Eve",
          "Fiona",
          "Kiki",
          "Kitty",
          "Lady",
          "Lilly",
          "Lisa",
          "Lola",
          "Lucy",
          "Luna",
        ]
      },
      perro: {
        macho: [
          "Milo",
          "Simon",
          "Teo",
          "Rocco",
          "Coco",
          "Totó",
          "Rocky",
          "Felipe",
          "Ciro",
          "Toby",
          "Pancho"
        ],
        hembra: [
          "Lola",
          "Luna",
          "Mora",
          "Olivia",
          "Nina",
          "Frida",
          "Uma",
          "Mía",
          "India",
          "Nala",
        ]
      }
    }
    let type = faker.helpers.arrayElement(['gato', 'perro']);
    let genders = faker.helpers.arrayElement(['macho', 'hembra']);
    let name = (type === 'gato' && genders === 'macho') ? faker.helpers.arrayElement(names.gato.macho) :
      (type === 'gato' && genders === 'hembra') ? faker.helpers.arrayElement(names.gato.hembra) :
        (type === 'perro' && genders === 'macho') ? faker.helpers.arrayElement(names.perro.macho) :
          (type === 'perro' && genders === 'hembra') ? faker.helpers.arrayElement(names.perro.hembra) : "Error"

    return {
      userId: faker.helpers.arrayElement(ids),
      name: name,
      typeId: type,
      breedId: (type === 'perro') ? faker.datatype.number({ min: 90, max: 460 }) : faker.datatype.number({ min: 1, max: 89 }),
      colorId: (type === 'perro') ? faker.datatype.number({ min: 30, max: 44 }) : faker.datatype.number({ min: 1, max: 29 }),
      age: faker.helpers.arrayElement(pets[0].ages),
      gender: genders,
      size: faker.helpers.arrayElement(pets[0].sizes),
      coat: faker.helpers.arrayElement(pets[0].coats),
      health: faker.helpers.arrayElement(pets[0].healths),
      description: faker.lorem.paragraphs(),
      tags: faker.helpers.arrayElements(pets[0].tags, faker.datatype.number({ min: 1, max: 6 })),
      castrated: faker.helpers.arrayElement([true, false]),
      attributes: JSON.stringify(faker.helpers.arrayElement([{
        house_trained: faker.helpers.arrayElement([true, false, null]),
        special_needs: faker.helpers.arrayElement([true, false, null]),
      }])),
      environment: JSON.stringify(faker.helpers.arrayElement([{
        children: faker.helpers.arrayElement([true, false, null]),
        dogs: faker.helpers.arrayElement([true, false, null]),
        cats: faker.helpers.arrayElement([true, false, null]),
      }])),
      status: faker.helpers.arrayElement(['adoptable', 'adoptado']),
      photos: faker.helpers.arrayElement(type === 'gato' ? pets[0].photos : pets[1].photos),
    };
  }

  for (let i = 0; i < results; i++) {
    data.push(await petsGenerated());
  }
  return data;
};

