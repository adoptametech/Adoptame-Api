import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./src/database/database.js";
import "./src/models/Country.js";
import "./src/models/User.js";
import "./src/models/Typepet.js";
import "./src/models/Breedpet.js";
import "./src/models/Colorpet.js";
import "./src/models/Solicitudes.js";
import "./src/models/Match.js"
import {
  preloadCountrys,
  preloadTypesPets,
  preloadFundations,
  preloadColorsPets,
  preloadUser,
  preloadPets
} from './src/utils/preloadData.js';

const PORT = process.env.PORT || 5000;
async function main() {
  try {
    const _FORCE = true;
    await sequelize.sync({ force: _FORCE });
    app.listen(PORT, async () => {
      _FORCE && await preloadCountrys();
      _FORCE && await preloadTypesPets();
      _FORCE && await preloadColorsPets();
      _FORCE && await preloadFundations();
      _FORCE && await preloadUser();
      _FORCE && await preloadPets(150);
      console.log(`Server runing in port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database " + error.message);
  }
}

main();
