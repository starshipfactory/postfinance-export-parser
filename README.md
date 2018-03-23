[![Build Status](https://travis-ci.org/starshipfactory/postfinance-export-parser.svg?branch=master)](https://travis-ci.org/starshipfactory/postfinance-export-parser)

## Purpose

This software extracts data from export "csv" files.

## Scope

1. Extract fields from a CSV-like structure
2. Apply some filter rules on extracted text to enrich transaction data (e.g. is it a payment, giro, who paid what)
3. Give the data back as a JSON or pojo to be able to do something with it (stats, filtering, searching)

## Requirements

* node >= 8
* npm >= 5 (usually ships with node)

Using nvm to install specific node versions is recommended.

## Installation

npm install

## Usage

1. Login to the portal and export your transactions as a "CSV"-file
2. Inspect index.js and change "file" variable to your exported data
3. Run `node index.js`
4. This shows you how much transactions were recognized and parsed. (TODO: [ ] export pojo)
5. (TODO: [ ] JSON export switch)
