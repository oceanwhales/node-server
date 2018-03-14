docker rm backend-api
docker build -t clem/backend-api . 
docker run -p 8082:8080 --name backend-api clem/backend-api

process.env.JWT_SECRET to define until a RS256 key is used
