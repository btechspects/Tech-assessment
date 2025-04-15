# Backend Data Ingestion & API Service

A scalable NestJS backend solution for ingesting large external JSON datasets from AWS S3, storing them efficiently in MongoDB, and exposing a filterable API endpoint.

## Background

It addresses the challenge of handling multiple JSON files (ranging from 1KB to 1GB), storing the data in a unified model, and providing filtering capabilities on any attribute.

## Features

- Ingests structured and unstructured JSON data from S3
- Supports datasets up to 1GB
- Unified MongoDB schema with indexing for optimized queries
- Attribute-based filtering (partial text, boolean, numeric range)
- Batch processing to handle large file ingestion
- Extensible data model to support new sources



### Unified Data Model

Data from different sources is normalized into a unified schema with optional fields. This provides flexibility and consistency for API querying.

### Performance Optimization

To handle large files:
- **Streaming via Axios** (optionally replaceable with streams if memory becomes an issue)
- **Batch Insertion** using `insertMany` in chunks of 1000 documents
- **MongoDB Indexing** on commonly queried fields (e.g., city, price)

## Project clone
```
git clone https://github.com/
cd tech_assessment
```

## Project setup
```
# Install dependencies
yarn install
# or
npm install
```

### Project run
```
# Start the development server
yarn run start
# or
npm run start
```

### Endpoints & Parameters
#### POST /data/ingest
Collect data from AWS S3.

#### GET /data?
- Full or partial match queries on attributes like `city`, `country`, etc.
- Boolean filters (e.g., `isAvailable`)
- Numeric range filters via `priceForNight=1000-5000`

### Run Unit Tests
```
yarn test
# or
npm run test
```
