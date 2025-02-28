docker-compose up -d --build

docker-compose down

docker-compose logs -f emqx

# 测试
node subscriber/app.js
