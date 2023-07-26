import { DataTypes, Model } from 'sequelize';
import util from 'util';
import connectToDB from './db.js';

export const db = await connectToDB('postgresql:///ratings');

class User extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
  },
  {
    modelName: 'user',
    sequelize: db,
  },
);

class Movie extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Movie.init(
  {
    movieId: {
      type: DataTypes.INTEGER,
      autoIncrement: true, 
      primaryKey: true, 
      field: 'movie_id'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    overview: {
      type: DataTypes.TEXT
    },
    releaseDate: {
      type: DataTypes.DATE,
      field: 'release_date'
    },
    posterPath: {
      type: DataTypes.STRING, 
      field: 'poster_path'
    }
  },
  {
    modelName: 'movie',
    sequelize: db,
  },
)

class Rating extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Rating.init(
  {
    ratingId: {
      type: DataTypes.INTEGER,
      autoIncrement: true, 
      primaryKey: true,
      field: 'rating_id'
    },
    score: {
      type: DataTypes.INTEGER
    },
  },
  {
    modelName: 'rating',
    sequelize: db,
    timestamps: true,
    updatedAt: false,
  }
)

Rating.belongsTo(User, {foreignKey: 'userID'});
User.hasMany(Rating,{foreignKey: 'userID'} )

Movie.hasMany(Rating, {foreignKey: 'movieId'});
Rating.belongsTo(Movie, {foreignKey: 'movieId'})

export { User, Movie, Rating };
