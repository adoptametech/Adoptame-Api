import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { City } from "./City.js";
import { Country } from "./Country.js";
import { Pets } from "./Pets.js";
import { UserPetsFavourite } from './FavouritePet.js';
import { Donations } from './Donations.js';
import { Coments } from "./comentsUser.js";

export const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["fundation", "user", "admin"],
      defaultValue: "user",
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    verification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    address: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    phone: {
      type: DataTypes.STRING
    },
    document: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    photo: {
      type: DataTypes.TEXT,
    },
    starts: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    comentario: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    points: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    }

  },
  {
    timestamps: false,
  }
);

User.hasMany(Pets, {
  foreignKey: "userId",
  sourceKey: "id",
});

Pets.belongsTo(User, {
  foreignKey: "userId",
  targetId: "id",
});
Country.hasMany(User, {
  foreignKey: "countryId",
  sourceKey: "id",
});
User.belongsTo(Country, {
  foreignKey: "countryId",
  targetId: "id",
});
City.hasMany(User, {
  foreignKey: "cityId",
  sourceKey: "id",
});
User.belongsTo(City, {
  foreignKey: "cityId",
  targetId: "id",
});

Pets.belongsToMany(User, {
  through: {
    model: UserPetsFavourite,
    unique: false
  },
  foreignKey: "petId",
  targetId: "id"
});

User.belongsToMany(Pets, {
  through: {
    model: UserPetsFavourite,
    unique: false
  },
  foreignKey: "userId",
  targetId: "id"
});

User.belongsToMany(User, {
  through: {
    model: Donations,
    unique: false
  },
  as: "from",
  foreignKey: "fromUserId",
});
User.belongsToMany(User, {
  through: {
    model: Donations,
    unique: false
  },
  as: "to",
  foreignKey: "toUserId",
});
User.hasMany(Coments, {
  foreignKey: "userId",
  sourceKey: "id",
});

Coments.belongsTo(User, {
  foreignKey: "userId",
  targetId: "id",
});