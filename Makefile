
.PHONY: run down build-no-cache

run:
	docker-compose up --build -d

down:
	docker-compose down

build-no-cache:
	docker-compose build --no-cache