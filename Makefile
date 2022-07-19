NAME	=	ft_transcendance

up:
	@echo "Starting services..."
	docker-compose up --build

down:
	@echo "Stopping services...\n"
	docker-compose down

fclean: clean
	@echo "\nSystem prune ..."
	@docker system prune -af
	@echo "\033[32mSuccess.\033[0m"

re: fclean up

.PHONY:	up down fclean re

