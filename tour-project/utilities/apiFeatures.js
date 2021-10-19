class APIFeatures {
  constructor(tourData, queryString) {
    this.tourData = tourData;
    this.queryString = queryString;
  }

  // filtering
  filter() {
    // advance filtering
    // we need {difficulty: easy, duration: {$gte: 5}}
    let queryStr = JSON.stringify(this.queryString);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.tourData.find(JSON.parse(queryStr));

    return this;
  }

  // sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replace(",", " "); // for 2 or more, use split() and join()
      this.tourData = this.tourData.sort(`${sortBy}`);
    } else {
      this.tourData = this.tourData.sort("-createdAt");
    }

    return this;
  }

  // field limiting
  fieldLimit() {
    if (this.queryString.fields) {
      const showFields = this.queryString.fields.split(",").join(" ");
      this.tourData = this.tourData.select(`${showFields}`);
    } else {
      this.tourData = this.tourData.select(`-__v`); // - means except __v, all data will be showed
    }

    return this;
  }

  // page pagination
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.tourData = this.tourData.skip(skip).limit(limit);

    return this;
  }
}


module.exports = APIFeatures;