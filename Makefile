# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: vico <vico@student.42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/07/19 16:31:57 by vico              #+#    #+#              #
#    Updated: 2022/07/22 18:59:02 by vico             ###   ########.fr        #
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
			@docker compose up --build -d
			@printf " $(GREEN)[$(NAME) done][✔] $(RESET)\n"

all:		 $(NAME)

install:
			sudo apt update && sudo apt install nodejs npm -y

clean:
			@printf "\n$(RED)Delete containers and volumes$(RESET)\n"
			@docker-compose down -v
			@printf "\n"

re:			clean all

.PHONY:		clean re all