// TODO change name to parcel to not conflict with JS keyword
class Package {
  // TODO add label messages
  // https://docs.shipengine.com/docs/custom-label-messages
  /**
     *
     * @param {Object} weight - Object with description of package weight
     * @param {number} weight.value - decimal number value of package weight
     * @param {string} weight.unit - unit of measurment
     * @param {string} package_code
     * @param {Object} [dimensions=null] - Physical dimensions of the package to ship
     * @param {Object} [dimensions.unit] - Unit of measurement for package dimensions
     * @param {number} [dimensions.length] - Decimal number for length of package to ship
     * @param {number} [dimensions.width] - Decimal number for width of package to ship
     * @param {number} [dimensions.height] - Deciaml number for height of package to ship
     * @param {number} [insured_value=null] - Decimal number (in USD) of amount to insure package for
     */
  constructor(weight, dimensions = null, package_code = null, insured_value = null) {
    this.weight = weight;

    if (package_code) this.package_code = package_code;
    if (dimensions) this.dimensions = dimensions;

    if (insured_value !== null) {
      this.insured_value = {
        currency: 'usd',
        amount: insured_value,
      };
    }
  }
}

export {
  Package
}
