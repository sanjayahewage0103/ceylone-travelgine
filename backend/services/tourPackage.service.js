const TourPackage = require('../models/tourPackage.model');

class TourPackageService {
  async createTourPackage(data) {
    const pkg = new TourPackage(data);
    return await pkg.save();
  }

  async getTourPackageById(id) {
    return await TourPackage.findById(id);
  }

  async getTourPackagesByGuide(guideId) {
    return await TourPackage.find({ guide_id: guideId });
  }

  async updateTourPackage(id, data) {
    return await TourPackage.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTourPackage(id) {
    return await TourPackage.findByIdAndDelete(id);
  }

  // Public: Get all published tour packages with filters/search/sort
  async getAllPublicTourPackages({ search, tourType, tourCategory, minPrice, maxPrice, sortBy, sortOrder }) {
    let query = { status: 'published' };
    if (search) {
      query.$or = [
        { package_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tourType: { $regex: search, $options: 'i' } },
        { tourCategory: { $regex: search, $options: 'i' } },
      ];
    }
    if (tourType) query.tourType = tourType;
    if (tourCategory) query.tourCategory = tourCategory;
    if (minPrice) query.price_lkr = { ...query.price_lkr, $gte: Number(minPrice) };
    if (maxPrice) query.price_lkr = { ...query.price_lkr, $lte: Number(maxPrice) };
    let sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    return await TourPackage.find(query).sort(sort);
  }
}

module.exports = new TourPackageService();
