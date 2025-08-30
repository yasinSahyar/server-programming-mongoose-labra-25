import {NextFunction, Request, Response} from 'express';
import {Animal} from '../../types/Animal';
import {MessageResponse} from '../../types/Messages';
import animalModel from '../models/animalModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Animal;
};

const postAnimal = async (
  req: Request<{}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newAnimal = new animalModel(req.body);
    const savedAnimal = await newAnimal.save();

    res.status(201).json({
      message: 'Animal created',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimals = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    res.json(
      await animalModel
        .find()
        .select('-__v')
        .populate({
          path: 'species',
          select: '-__v',
          populate: {
            path: 'category',
            select: '-__v',
          },
        }),
    );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimal = async (
  req: Request<{id: string}>,
  res: Response<Animal>,
  next: NextFunction,
) => {
  try {
    const animal = await animalModel
      .findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {
          path: 'category',
          select: '-__v',
        },
      });
    if (!animal) {
      return next(new CustomError('Animal not found', 404));
    }
    res.json(animal);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putAnimal = async (
  req: Request<{id: string}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const animal = await animalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );
    if (!animal) {
      return next(new CustomError('Animal not found', 404));
    }
    res.status(200).json({
      message: 'Animal updated',
      data: animal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const animal = await animalModel.findByIdAndDelete(req.params.id);
    if (!animal) {
      return next(new CustomError('Animal not found', 404));
    }
    res.status(200).json({
      message: 'Animal deleted',
      data: animal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalsByBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const {topRight, bottomLeft} = req.query;

    res.json(
      await animalModel
        .find({
          location: {
            $geoWithin: {
              $box: [topRight.split(','), bottomLeft.split(',')],
            },
          },
        })
        .select('-__v')
        .populate({
          path: 'species',
          select: '-__v',
          populate: {
            path: 'category',
            select: '-__v',
          },
        }),
    );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getBySpeciesName = async (
  req: Request<{species_name: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    res.json(await animalModel.findBySpecies(req.params.species_name));
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  postAnimal,
  getAnimals,
  getAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsByBox,
  getBySpeciesName,
};
