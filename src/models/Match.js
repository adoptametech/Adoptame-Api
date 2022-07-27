import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";

export const Match = sequelize.define(
  "match",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    age:  {
      type: DataTypes.STRING,
      defaultValue : null
    },
    coat:{
        type: DataTypes.STRING,
        defaultValue : null
    },
    genre:{
        type: DataTypes.STRING,
        defaultValue : null
    },
    haTenidoMascota:{
        type: DataTypes.STRING,
        defaultValue : null
    },
    size:{
        type: DataTypes.STRING,
        defaultValue : null
    },
    type:{
        type: DataTypes.STRING,
        defaultValue : null
    },

    
   
 
  },
  {
    timestamps: false,
  }
);



User.hasOne(Match,{
    foreignKey:"userId",
    sourceKey: "id",
  })

