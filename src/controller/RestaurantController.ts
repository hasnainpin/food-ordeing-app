import { Request, Response } from "express";
import Restaurant from "../Models/rastaurant";

const searchMyRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisine = (req.query.searchQuery as string) || "";
    const sortOption = (req.query.searchQuery as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;
    let query: any = {};
    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
      return;
    }
    if (selectedCuisine) {
      const cuisineArray = selectedCuisine
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisine"] = { $all: cuisineArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisine: { $in: [searchRegex] } },
      ];
    }
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const restaurant = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);
    const response = {
      data: restaurant,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error, "restaurant search error  ");
    res.status(500).json({ message: "error search restaurant" });
  }
};

export default {
  searchMyRestaurant,
};
