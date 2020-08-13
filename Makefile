docker-build:
	@docker build --rm -t server/reactions .

docker-start:
	@docker stack deploy -c ./docker-compose.yml reactions

docker-update:
	@make docker-build
	@docker service update --force -d server_reactions

docker-stop:
	@docker stack rm reactions

docker-logs:
	@docker service logs server_reactions -f

docker-start-logs:
	@make docker-start
	@make docker-logs

docker-init:
	@make docker-build
	@make docker-start-logs

docker-restart:
	@make docker-stop
	@make docker-start-logs

docker-clean:
	@docker volume rm server_reactions-data
	@docker image rm server/reactions

docker-bash:
	@docker exec -it `docker container ls | grep reactions | cut -d " " -f 1` bash

docker:
	@echo $@a