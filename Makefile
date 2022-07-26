# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: vico <vico@student.42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/07/19 16:31:57 by vico              #+#    #+#              #
#    Updated: 2022/07/26 16:41:36 by vico             ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

BLUE		= \033[0;34m
GREEN		= \033[0;32m
LIGHTBLUE	= \033[1;34m
RED			= \033[0;31m
YELLOW		= \033[1;33m
ORANGE		= \033[0;33m
MAGENTA		= \033[0;35m
RESET		= \033[0m

NAME		= project

$(NAME):	
			@printf "\n$(BLUE)Build images, containers and volumes...$(RESET)"
			@cd backend;npm install;cd ../
			@cd frontend;npm install;cd ../
			@docker compose up --build -d
			@printf " $(GREEN)[$(NAME) done][✔] $(RESET)\n"

all:		 $(NAME)

install:
			sudo apt update && sudo apt install nodejs npm -y

clean:
			@printf "\n$(RED)Delete containers and volumes$(RESET)\n"
			@docker-compose down -v

fclean:		clean
			@printf "$(RED)Delete modules..."
			@rm -rf backend/node_modules
			@rm -rf frontend/node_modules
			@printf "\n$(RED)Delete images...$(RESET)"
			@docker image rm frontend backend postgres:14.4 dpage/pgadmin4:6.11
			@printf "\n"

re:			clean all

.PHONY:		clean re all