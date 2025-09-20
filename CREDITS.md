# Credits and Data Sources

This project utilizes data from GeoNames under the Creative Commons Attribution 4.0 License and incorporates third-party libraries.

## GeoNames Data

This product includes data from [GeoNames](http://www.geonames.org/) geographical database, which is licensed under:

**Creative Commons Attribution 4.0 License**
(CC BY 4.0 - https://creativecommons.org/licenses/by/4.0/)

### Attribution Requirements

In accordance with the CC BY 4.0 license, proper attribution to GeoNames is required:

**Data provided by:** GeoNames (www.geonames.org)
**License:** Creative Commons Attribution 4.0 International License

### Data Sources and Usage

This project utilizes data from GeoNames obtained through automated periodic updates.

#### Data Acquisition Method

- **Source:** GeoNames Web API (`countryInfoJSON` service)
- **Endpoint:** `http://api.geonames.org/countryInfoJSON`
- **Method:** Automated script executed periodically to fetch and store a snapshot of country data
- **Purpose:** To maintain an up-to-date local repository of country information for offline use

#### Local Data Storage

The following data is extracted from the API response, curated, and stored locally:

- Country names and ISO codes (ISO 3166-1 alpha-2)
- Capital cities
- Population data

#### Data Modifications

The original GeoNames data has been enhanced with:

- Data quality improvements and error corrections
- Accuracy validation and curation
- Formatting consistency improvements

#### Update Frequency

The data update script is typically run:

- Manually when needed
- **Last Updated:** <!-- DATASET_UPDATE_DATE -->2025-09-20<!-- /DATASET_UPDATE_DATE -->

## Third-Party Libraries

### Flag Icons

This project uses [flag-icons](https://github.com/lipis/flag-icons) npm package for country flag displays.

- **Source:** https://github.com/lipis/flag-icons
- **License:** MIT License
- **Usage:** Displaying country flags alongside country information
- **Version:** <!-- FLAG_ICONS_VERSION -->7.5.0<!-- /FLAG_ICONS_VERSION -->

---

_This notice must be retained in all copies or substantial portions of the software and documentation._
