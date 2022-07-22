import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Coments = sequelize.define(
    "coments",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );