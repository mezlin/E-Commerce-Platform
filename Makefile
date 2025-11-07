
.PHONY: run

run:
	docker-compose up --build -d

build-no-cache:
	docker-compose build --no-cache