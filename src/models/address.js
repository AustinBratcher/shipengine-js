class Address {
  /**
     *
     * @param {string} name - name of person/business associated with address
     * @param {string} city_locality - city for address
     * @param {string} state_province - state for address (formatted as two character abbreviation (TX))
     * @param {string} postal_code - postal code for address
     * @param {string} country_code - country code for address (formatted as two character abbreviation (US))
     * @param {string} address_line1 - Street address
     * @param {string} [address_line2=''] - Street address (optional)
     * @param {string} [phone=''] - Phone for address (optional)
     * @param {string} [company_name=''] - Company name for address (optional)
     * @param {string} [address_residential_indicator='no'] - Indicates of address is residential (options are "no" or "yes")
     */
  constructor(
    name,
    city_locality,
    state_province,
    postal_code,
    country_code,
    address_line1,
    address_line2 = '',
    phone = '',
    company_name = '',
    address_residential_indicator = 'no',
  ) {
    // TODO reevaluate how parameters are passed to create address
    this.name = name;
    if (phone.length) this.phone = phone;
    if (company_name.length) this.company_name = company_name;
    this.address_line1 = address_line1;
    if (address_line2.length) this.address_line2 = address_line2;
    this.city_locality = city_locality;
    this.state_province = state_province;
    this.postal_code = postal_code;
    this.country_code = country_code;
    this.address_residential_indicator = address_residential_indicator;
  }
}

Address.VALIDATION_OPTIONS = {
  NO_VALIDATION: 'no_validation',
  VALIDATE_ONLY: 'validate_only',
  VALIDATE_AND_CLEAN: 'validate_and_clean',
};

Address.MESSAGES = {
  a1001: 'The country is not supported.',
  a1002: 'Parts of the address could not be verified.',
  a1003: 'Some fields were modified while verifying the address.',
  a1004: 'The address was found but appears incomplete.',
  a1005: 'The address failed pre-validation.',
};

export {
  Address
}
